const API_BASE = '/api/v1';
const SESSION_KEY = 'library_dashboard_session_v1';

const state = {
  token: null,
  user: null,
  books: [],
  booksMeta: {
    page: 1,
    limit: 10,
    total: 0,
  },
  myBorrows: [],
  allBorrows: [],
  currentKeyword: '',
};

const dom = {
  authStatus: document.getElementById('authStatus'),
  logoutBtn: document.getElementById('logoutBtn'),
  loginForm: document.getElementById('loginForm'),
  registerForm: document.getElementById('registerForm'),

  profileName: document.getElementById('profileName'),
  profileEmail: document.getElementById('profileEmail'),
  profileRole: document.getElementById('profileRole'),

  adminPanel: document.getElementById('adminPanel'),
  createBookForm: document.getElementById('createBookForm'),
  updateBookForm: document.getElementById('updateBookForm'),
  deleteBookForm: document.getElementById('deleteBookForm'),

  statTotalBooks: document.getElementById('statTotalBooks'),
  statAvailableCopies: document.getElementById('statAvailableCopies'),
  statMyBorrows: document.getElementById('statMyBorrows'),
  statOpenBorrows: document.getElementById('statOpenBorrows'),

  bookKeyword: document.getElementById('bookKeyword'),
  bookSearchBtn: document.getElementById('bookSearchBtn'),
  dueDateInput: document.getElementById('dueDateInput'),
  booksMeta: document.getElementById('booksMeta'),
  booksTbody: document.getElementById('booksTbody'),
  prevPageBtn: document.getElementById('prevPageBtn'),
  nextPageBtn: document.getElementById('nextPageBtn'),

  myBorrowsTbody: document.getElementById('myBorrowsTbody'),
  refreshMyBorrowsBtn: document.getElementById('refreshMyBorrowsBtn'),

  externalTitleInput: document.getElementById('externalTitleInput'),
  externalSearchBtn: document.getElementById('externalSearchBtn'),
  externalList: document.getElementById('externalList'),

  adminBorrowsPanel: document.getElementById('adminBorrowsPanel'),
  allBorrowsTbody: document.getElementById('allBorrowsTbody'),
  refreshAllBorrowsBtn: document.getElementById('refreshAllBorrowsBtn'),

  toastContainer: document.getElementById('toastContainer'),
};

function getRoleLabel(role) {
  if (role === 'admin') {
    return 'quản trị viên';
  }
  if (role === 'user') {
    return 'người dùng';
  }
  return 'khách';
}

function getBorrowStatusLabel(status) {
  if (status === 'borrowing') {
    return 'đang mượn';
  }
  if (status === 'returned') {
    return 'đã trả';
  }
  if (status === 'late') {
    return 'quá hạn';
  }
  return status || '-';
}

function loadSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return;
  }

  try {
    const session = JSON.parse(raw);
    state.token = session.token || null;
    state.user = session.user || null;
  } catch (_error) {
    localStorage.removeItem(SESSION_KEY);
  }
}

function saveSession() {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      token: state.token,
      user: state.user,
    })
  );
}

function clearSession() {
  state.token = null;
  state.user = null;
  localStorage.removeItem(SESSION_KEY);
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  dom.toastContainer.appendChild(toast);
  window.setTimeout(() => {
    toast.remove();
  }, 3000);
}

function formatDate(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN')}`;
}

function setButtonLoading(button, isLoading, loadingText = 'Đang xử lý...') {
  if (!button) {
    return;
  }

  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
    return;
  }

  if (button.dataset.originalText) {
    button.textContent = button.dataset.originalText;
    delete button.dataset.originalText;
  }
  button.disabled = false;
}

async function apiRequest(path, options = {}) {
  const config = {
    method: options.method || 'GET',
    headers: {},
  };

  if (options.auth) {
    if (!state.token) {
      throw new Error('Vui lòng đăng nhập trước.');
    }
    config.headers.Authorization = `Bearer ${state.token}`;
  }

  if (options.body !== undefined) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);
  let payload;

  try {
    payload = await response.json();
  } catch (_error) {
    payload = {
      success: false,
      message: 'Phản hồi từ máy chủ không hợp lệ.',
    };
  }

  if (!response.ok || payload.success === false) {
    const error = new Error(payload.message || `Yêu cầu thất bại (${response.status}).`);
    error.payload = payload;
    error.status = response.status;
    throw error;
  }

  return payload;
}

function getDefaultDueDate() {
  const today = new Date();
  today.setDate(today.getDate() + 7);
  return today.toISOString().slice(0, 10);
}

function toOptionalNumber(value) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return undefined;
  }

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? undefined : numberValue;
}

function updateAuthView() {
  if (!state.user) {
    dom.authStatus.textContent = 'Chế độ khách';
    dom.authStatus.className = 'pill muted';
    dom.logoutBtn.disabled = true;
    dom.profileName.textContent = 'Chưa đăng nhập';
    dom.profileEmail.textContent = '-';
    dom.profileRole.textContent = 'khách';
    dom.adminPanel.hidden = true;
    dom.adminBorrowsPanel.hidden = true;
    return;
  }

  dom.authStatus.textContent = `Đã đăng nhập: ${getRoleLabel(state.user.role)}`;
  dom.authStatus.className = `pill ${state.user.role === 'admin' ? 'admin' : 'muted'}`;
  dom.logoutBtn.disabled = false;
  dom.profileName.textContent = state.user.name;
  dom.profileEmail.textContent = state.user.email;
  dom.profileRole.textContent = getRoleLabel(state.user.role);

  const isAdmin = state.user.role === 'admin';
  dom.adminPanel.hidden = !isAdmin;
  dom.adminBorrowsPanel.hidden = !isAdmin;
}

function updateStats() {
  dom.statTotalBooks.textContent = String(state.booksMeta.total || 0);

  const availableTotal = state.books.reduce(
    (accumulator, item) => accumulator + Number(item.available_copies || 0),
    0
  );
  dom.statAvailableCopies.textContent = String(availableTotal);
  dom.statMyBorrows.textContent = String(state.myBorrows.length);

  const openBorrows = state.myBorrows.filter((item) => item.status === 'borrowing').length;
  dom.statOpenBorrows.textContent = String(openBorrows);
}

function updateBookPagination() {
  const page = state.booksMeta.page || 1;
  const limit = state.booksMeta.limit || 10;
  const total = state.booksMeta.total || 0;
  const maxPage = Math.max(1, Math.ceil(total / limit));

  dom.booksMeta.textContent = `Trang ${page} / ${maxPage} - ${total} đầu sách`;
  dom.prevPageBtn.disabled = page <= 1;
  dom.nextPageBtn.disabled = page >= maxPage;
}

function renderBooks() {
  if (state.books.length === 0) {
    dom.booksTbody.innerHTML = '<tr><td colspan="5">Không tìm thấy sách.</td></tr>';
    updateStats();
    updateBookPagination();
    return;
  }

  dom.booksTbody.innerHTML = state.books
    .map((book) => {
      const canBorrow = Boolean(state.user) && Number(book.available_copies) > 0;
      return `
        <tr>
          <td>${book.id}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.available_copies} / ${book.total_copies}</td>
          <td>
            <button
              class="btn soft"
              type="button"
              data-action="borrow"
              data-book-id="${book.id}"
              ${canBorrow ? '' : 'disabled'}
            >
              Mượn
            </button>
          </td>
        </tr>
      `;
    })
    .join('');

  updateStats();
  updateBookPagination();
}

function renderMyBorrows() {
  if (!state.user) {
    dom.myBorrowsTbody.innerHTML = '<tr><td colspan="6">Cần đăng nhập để xem dữ liệu.</td></tr>';
    updateStats();
    return;
  }

  if (state.myBorrows.length === 0) {
    dom.myBorrowsTbody.innerHTML = '<tr><td colspan="6">Chưa có lượt mượn nào.</td></tr>';
    updateStats();
    return;
  }

  dom.myBorrowsTbody.innerHTML = state.myBorrows
    .map((borrow) => {
      const canReturn = borrow.status === 'borrowing';
      return `
        <tr>
          <td>${borrow.id}</td>
          <td>${borrow.book_title}</td>
          <td>${getBorrowStatusLabel(borrow.status)}</td>
          <td>${formatDate(borrow.borrowed_at)}</td>
          <td>${borrow.due_date || '-'}</td>
          <td>
            <button
              class="btn ghost"
              type="button"
              data-action="return"
              data-borrow-id="${borrow.id}"
              ${canReturn ? '' : 'disabled'}
            >
              Trả sách
            </button>
          </td>
        </tr>
      `;
    })
    .join('');

  updateStats();
}

function renderAllBorrows() {
  if (!state.user || state.user.role !== 'admin') {
    dom.allBorrowsTbody.innerHTML = '';
    return;
  }

  if (state.allBorrows.length === 0) {
    dom.allBorrowsTbody.innerHTML = '<tr><td colspan="6">Không có lượt mượn.</td></tr>';
    return;
  }

  dom.allBorrowsTbody.innerHTML = state.allBorrows
    .map((borrow) => {
      const canReturn = borrow.status === 'borrowing';
      return `
        <tr>
          <td>${borrow.id}</td>
          <td>${borrow.user_name} (${borrow.user_email})</td>
          <td>${borrow.book_title}</td>
          <td>${getBorrowStatusLabel(borrow.status)}</td>
          <td>${borrow.due_date || '-'}</td>
          <td>
            <button
              class="btn ghost"
              type="button"
              data-action="return-admin"
              data-borrow-id="${borrow.id}"
              ${canReturn ? '' : 'disabled'}
            >
              Trả sách
            </button>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderExternal(items) {
  if (!items || items.length === 0) {
    dom.externalList.innerHTML = '<li>Không có kết quả từ nguồn ngoài.</li>';
    return;
  }

  dom.externalList.innerHTML = items
    .map((book) => {
      const authors = Array.isArray(book.author) ? book.author.join(', ') : book.author || '-';
      const languages = Array.isArray(book.languages) ? book.languages.join(', ') : book.languages || '-';
      const year = book.first_publish_year || '-';
      return `
        <li>
          <div class="title">${book.title || 'Không có tiêu đề'}</div>
          <div class="meta">Tác giả: ${authors}</div>
          <div class="meta">Năm xuất bản đầu tiên: ${year}</div>
          <div class="meta">Ngôn ngữ: ${languages}</div>
        </li>
      `;
    })
    .join('');
}

async function loadBooks(page = state.booksMeta.page || 1, keyword = state.currentKeyword) {
  const search = new URLSearchParams({
    page: String(page),
    limit: String(state.booksMeta.limit || 10),
    keyword: keyword || '',
  });
  const payload = await apiRequest(`/books?${search.toString()}`);
  state.books = payload.data || [];
  state.booksMeta = payload.meta || state.booksMeta;
  renderBooks();
}

async function loadMyBorrows() {
  if (!state.user) {
    state.myBorrows = [];
    renderMyBorrows();
    return;
  }

  const payload = await apiRequest('/borrows/my', { auth: true });
  state.myBorrows = payload.data || [];
  renderMyBorrows();
}

async function loadAllBorrows() {
  if (!state.user || state.user.role !== 'admin') {
    state.allBorrows = [];
    renderAllBorrows();
    return;
  }

  const payload = await apiRequest('/admin/borrows', { auth: true });
  state.allBorrows = payload.data || [];
  renderAllBorrows();
}

async function syncProfile() {
  if (!state.token) {
    state.user = null;
    updateAuthView();
    return;
  }

  try {
    const payload = await apiRequest('/auth/me', { auth: true });
    state.user = payload.data;
    saveSession();
  } catch (_error) {
    clearSession();
    showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'warning');
  }

  updateAuthView();
}

async function refreshAllData() {
  await loadBooks(state.booksMeta.page || 1, state.currentKeyword);
  await loadMyBorrows();
  await loadAllBorrows();
}

async function login(email, password) {
  const payload = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  state.token = payload.data.access_token;
  state.user = payload.data.user;
  saveSession();
  updateAuthView();
  await refreshAllData();
}

async function register(name, email, password) {
  await apiRequest('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

async function borrowBook(bookId) {
  if (!state.user) {
    throw new Error('Vui lòng đăng nhập trước khi mượn sách.');
  }

  const body = { book_id: Number(bookId) };
  if (dom.dueDateInput.value) {
    body.due_date = dom.dueDateInput.value;
  }

  await apiRequest('/borrows', {
    method: 'POST',
    auth: true,
    body,
  });

  await refreshAllData();
}

async function returnBorrow(borrowId) {
  if (!state.user) {
    throw new Error('Vui lòng đăng nhập trước.');
  }

  await apiRequest(`/borrows/${borrowId}/return`, {
    method: 'PATCH',
    auth: true,
  });

  await refreshAllData();
}

async function createBook(formData) {
  await apiRequest('/books', {
    method: 'POST',
    auth: true,
    body: {
      title: formData.get('title'),
      author: formData.get('author'),
      isbn: formData.get('isbn') || null,
      published_year: toOptionalNumber(formData.get('published_year')) || null,
      total_copies: Number(formData.get('total_copies')),
      available_copies: toOptionalNumber(formData.get('available_copies')),
    },
  });
}

async function updateBook(formData) {
  const id = Number(formData.get('id'));
  const payload = {};

  const title = formData.get('title');
  if (String(title).trim()) {
    payload.title = String(title).trim();
  }

  const author = formData.get('author');
  if (String(author).trim()) {
    payload.author = String(author).trim();
  }

  const isbn = formData.get('isbn');
  if (String(isbn).trim()) {
    payload.isbn = String(isbn).trim();
  }

  const publishedYear = toOptionalNumber(formData.get('published_year'));
  if (publishedYear !== undefined) {
    payload.published_year = publishedYear;
  }

  const totalCopies = toOptionalNumber(formData.get('total_copies'));
  if (totalCopies !== undefined) {
    payload.total_copies = totalCopies;
  }

  const availableCopies = toOptionalNumber(formData.get('available_copies'));
  if (availableCopies !== undefined) {
    payload.available_copies = availableCopies;
  }

  if (Object.keys(payload).length === 0) {
    throw new Error('Vui lòng nhập ít nhất một trường để cập nhật.');
  }

  await apiRequest(`/books/${id}`, {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
}

async function deleteBook(id) {
  await apiRequest(`/books/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}

async function searchExternal(title) {
  const search = new URLSearchParams({
    title,
    limit: '8',
  });
  const payload = await apiRequest(`/external/books/search?${search.toString()}`);
  return payload.data || [];
}

function bindEvents() {
  dom.loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = dom.loginForm.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true, 'Đang đăng nhập...');

    try {
      const formData = new FormData(dom.loginForm);
      await login(String(formData.get('email')), String(formData.get('password')));
      showToast('Đăng nhập thành công.', 'success');
      dom.loginForm.reset();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });

  dom.registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = dom.registerForm.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true, 'Đang tạo...');

    try {
      const formData = new FormData(dom.registerForm);
      await register(
        String(formData.get('name')),
        String(formData.get('email')),
        String(formData.get('password'))
      );
      showToast('Đăng ký thành công. Bạn có thể đăng nhập ngay.', 'success');
      dom.registerForm.reset();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });

  dom.logoutBtn.addEventListener('click', () => {
    clearSession();
    state.myBorrows = [];
    state.allBorrows = [];
    updateAuthView();
    renderMyBorrows();
    renderAllBorrows();
    renderBooks();
    showToast('Đã đăng xuất.', 'success');
  });

  dom.bookSearchBtn.addEventListener('click', async () => {
    state.currentKeyword = dom.bookKeyword.value.trim();
    state.booksMeta.page = 1;

    try {
      await loadBooks(1, state.currentKeyword);
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  dom.bookKeyword.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      dom.bookSearchBtn.click();
    }
  });

  dom.prevPageBtn.addEventListener('click', async () => {
    const nextPage = Math.max(1, (state.booksMeta.page || 1) - 1);
    try {
      await loadBooks(nextPage, state.currentKeyword);
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  dom.nextPageBtn.addEventListener('click', async () => {
    const nextPage = (state.booksMeta.page || 1) + 1;
    try {
      await loadBooks(nextPage, state.currentKeyword);
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  dom.booksTbody.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action="borrow"]');
    if (!button) {
      return;
    }

    try {
      setButtonLoading(button, true, 'Đang mượn...');
      await borrowBook(button.dataset.bookId);
      showToast('Mượn sách thành công.', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setButtonLoading(button, false);
    }
  });

  dom.myBorrowsTbody.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action="return"]');
    if (!button) {
      return;
    }

    try {
      setButtonLoading(button, true, 'Đang trả...');
      await returnBorrow(button.dataset.borrowId);
      showToast('Trả sách thành công.', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setButtonLoading(button, false);
    }
  });

  dom.refreshMyBorrowsBtn.addEventListener('click', async () => {
    try {
      await loadMyBorrows();
      showToast('Đã làm mới lượt mượn của bạn.', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  dom.externalSearchBtn.addEventListener('click', async () => {
    const title = dom.externalTitleInput.value.trim();
    if (!title) {
      showToast('Vui lòng nhập từ khóa tiêu đề.', 'warning');
      return;
    }

    setButtonLoading(dom.externalSearchBtn, true, 'Đang tìm...');
    try {
      const items = await searchExternal(title);
      renderExternal(items);
      showToast('Tìm kiếm nguồn ngoài hoàn tất.', 'success');
    } catch (error) {
      showToast(error.message, 'error');
      renderExternal([]);
    } finally {
      setButtonLoading(dom.externalSearchBtn, false);
    }
  });

  dom.externalTitleInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      dom.externalSearchBtn.click();
    }
  });

  dom.createBookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = dom.createBookForm.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true, 'Đang tạo...');
    try {
      await createBook(new FormData(dom.createBookForm));
      dom.createBookForm.reset();
      await refreshAllData();
      showToast('Tạo sách thành công.', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });

  dom.updateBookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = dom.updateBookForm.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true, 'Đang cập nhật...');
    try {
      await updateBook(new FormData(dom.updateBookForm));
      dom.updateBookForm.reset();
      await refreshAllData();
      showToast('Cập nhật sách thành công.', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });

  dom.deleteBookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = dom.deleteBookForm.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true, 'Đang xóa...');
    try {
      const formData = new FormData(dom.deleteBookForm);
      await deleteBook(Number(formData.get('id')));
      dom.deleteBookForm.reset();
      await refreshAllData();
      showToast('Xóa sách thành công.', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });

  dom.allBorrowsTbody.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action="return-admin"]');
    if (!button) {
      return;
    }

    try {
      setButtonLoading(button, true, 'Đang trả...');
      await returnBorrow(button.dataset.borrowId);
      showToast('Admin đã trả sách cho lượt mượn này.', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setButtonLoading(button, false);
    }
  });

  dom.refreshAllBorrowsBtn.addEventListener('click', async () => {
    try {
      await loadAllBorrows();
      showToast('Đã làm mới toàn bộ lượt mượn.', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

async function bootstrap() {
  loadSession();
  dom.dueDateInput.value = getDefaultDueDate();
  updateAuthView();
  bindEvents();

  try {
    await syncProfile();
    await refreshAllData();
    renderExternal([]);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

bootstrap();
