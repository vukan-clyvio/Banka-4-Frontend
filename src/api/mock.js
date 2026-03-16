import api from './client';

const DELAY = 600;

const delay = ms => new Promise(r => setTimeout(r, ms));

const FAKE_EMPLOYEE = {
  employee_id:   1,
  first_name:    'Petar',
  last_name:     'Petrović',
  email:         'petar.petrovic@rafbank.rs',
  username:      'ppetrovic',
  gender:        'M',
  date_of_birth: '1985-03-15',
  phone_number:  '+381601234567',
  address:       'Knez Mihailova 10, Beograd',
  department:    'Management',
  position_id:   1,
  active:        true,
  is_admin:      true,
  permissions: [
    'employee.view',
    'employee.create',
    'employee.update',
    'employee.delete',
    'account.create',
  ],
};

const FAKE_EMPLOYEES = [
  { employee_id: 1, first_name: 'Petar',   last_name: 'Petrović',  email: 'petar.petrovic@rafbank.rs',    username: 'ppetrovic',  position_id: 1, department: 'Management', active: true,  gender: 'M', date_of_birth: '1985-03-15', phone_number: '+381601234567', address: 'Knez Mihailova 10' },
  { employee_id: 2, first_name: 'Ana',     last_name: 'Jovanović', email: 'ana.jovanovic@rafbank.rs',     username: 'ajovanovic', position_id: 2, department: 'Finance',    active: true,  gender: 'F', date_of_birth: '1990-07-22', phone_number: '+381601234568', address: 'Bulevar Kralja Aleksandra 5' },
  { employee_id: 3, first_name: 'Marko',   last_name: 'Nikolić',   email: 'marko.nikolic@rafbank.rs',     username: 'mnikolic',   position_id: 3, department: 'IT',         active: true,  gender: 'M', date_of_birth: '1992-11-03', phone_number: '+381601234569', address: 'Nemanjina 15' },
  { employee_id: 4, first_name: 'Jelena',  last_name: 'Đorđević',  email: 'jelena.djordjevic@rafbank.rs', username: 'jdjordjevic', position_id: 4, department: 'Finance',   active: false, gender: 'F', date_of_birth: '1988-01-10', phone_number: '+381601234570', address: 'Cara Dušana 20' },
  { employee_id: 5, first_name: 'Stefan',  last_name: 'Popović',   email: 'stefan.popovic@rafbank.rs',    username: 'spopovic',   position_id: 5, department: 'IT',         active: true,  gender: 'M', date_of_birth: '1995-05-18', phone_number: '+381601234571', address: 'Terazije 8' },
  { employee_id: 6, first_name: 'Milica',  last_name: 'Stanković', email: 'milica.stankovic@rafbank.rs',  username: 'mstankovic', position_id: 6, department: 'HR',         active: true,  gender: 'F', date_of_birth: '1991-09-25', phone_number: '+381601234572', address: 'Savska 30' },
  { employee_id: 7, first_name: 'Nikola',  last_name: 'Ilić',      email: 'nikola.ilic@rafbank.rs',       username: 'nilic',      position_id: 7, department: 'IT',         active: false, gender: 'M', date_of_birth: '1993-12-07', phone_number: '+381601234573', address: 'Vojvode Stepe 42' },
  { employee_id: 8, first_name: 'Ivana',   last_name: 'Marković',  email: 'ivana.markovic@rafbank.rs',    username: 'imarkovic',  position_id: 8, department: 'Finance',    active: true,  gender: 'F', date_of_birth: '1989-04-14', phone_number: '+381601234574', address: 'Balkanska 12' },
];

const FAKE_CLIENTS = [
  { id: 101, first_name: 'Marko',  last_name: 'Nikolić',  email: 'marko.nikolic@gmail.com', jmbg: '0411990710002' },
  { id: 102, first_name: 'Jelena', last_name: 'Milić',    email: 'jelena.milic@gmail.com',  jmbg: '1209985710003' },
  { id: 103, first_name: 'Petar',  last_name: 'Petrović', email: 'petar@gmail.com',          jmbg: '0306025710001' },
];

const FAKE_ACCOUNTS = [];

api.interceptors.request.use(async config => {
  await delay(DELAY);

  const { method, url, data: rawData, params } = config;
  const data = typeof rawData === 'string' ? JSON.parse(rawData || '{}') : rawData ?? {};
  const path = url?.replace(import.meta.env.VITE_API_URL ?? '', '') ?? '';

  if (method === 'post' && path === '/auth/login') {
    if (data.username && data.password) {
      return throwFakeResponse(config, {
        access_token:  'fake-jwt-token-123',
        token:         'fake-jwt-token-123',
        refresh_token: 'fake-refresh-token-456',
        expires_in:    3600,
        employee:      FAKE_EMPLOYEE,
        user:          FAKE_EMPLOYEE,
      });
    }
    return throwFakeError(config, 401, 'Pogrešan username ili lozinka.');
  }

  if (method === 'post' && path === '/login') {
    if (data.email && data.password) {
      return throwFakeResponse(config, {
        token:         'fake-jwt-token-123',
        refresh_token: 'fake-refresh-token-456',
        user:          FAKE_EMPLOYEE,
      });
    }
    return throwFakeError(config, 401, 'Pogrešan email ili lozinka.');
  }

  if (method === 'post' && path === '/refresh') {
    return throwFakeResponse(config, {
      token:         'fake-jwt-token-renewed',
      refresh_token: 'fake-refresh-token-renewed',
    });
  }

  if (method === 'post' && path === '/auth/register') {
    const novi = { employee_id: Date.now(), ...data };
    FAKE_EMPLOYEES.push(novi);
    return throwFakeResponse(config, { data: novi, message: 'Zaposleni je kreiran.' }, 201);
  }

  if (method === 'post' && path === '/register') {
    const novi = { employee_id: Date.now(), ...data };
    FAKE_EMPLOYEES.push(novi);
    return throwFakeResponse(config, { data: novi, message: 'Zaposleni je kreiran.' }, 201);
  }

  if (method === 'post' && path === '/auth/activate') {
    return throwFakeResponse(config, { message: 'Nalog je aktiviran.' });
  }

  if (method === 'post' && path === '/activate') {
    return throwFakeResponse(config, { message: 'Nalog je aktiviran.' });
  }

  if (method === 'post' && (path === '/auth/forgot-password' || path === '/forgot-password')) {
    return throwFakeResponse(config, { message: 'Email je poslat.' });
  }

  if (method === 'post' && (path === '/auth/reset-password' || path === '/reset-password')) {
    return throwFakeResponse(config, { message: 'Lozinka je promenjena.' });
  }

  if (method === 'post' && path === '/employees/change-password') {
    return throwFakeResponse(config, { message: 'Lozinka je uspešno promenjena.' });
  }

  const idMatch = path.match(/^\/employees\/(\d+)$/);

  if (method === 'get' && idMatch) {
    const emp = FAKE_EMPLOYEES.find(e => e.employee_id === Number(idMatch[1]));
    if (emp) return throwFakeResponse(config, { data: emp });
    return throwFakeError(config, 404, 'Zaposleni nije pronađen.');
  }

  if (method === 'put' && idMatch) {
    const idx = FAKE_EMPLOYEES.findIndex(e => e.employee_id === Number(idMatch[1]));
    if (idx !== -1) {
      Object.assign(FAKE_EMPLOYEES[idx], data);
      return throwFakeResponse(config, { data: FAKE_EMPLOYEES[idx], message: 'Zaposleni je ažuriran.' });
    }
    return throwFakeError(config, 404, 'Zaposleni nije pronađen.');
  }

  if (method === 'delete' && idMatch) {
    const idx = FAKE_EMPLOYEES.findIndex(e => e.employee_id === Number(idMatch[1]));
    if (idx !== -1) {
      FAKE_EMPLOYEES.splice(idx, 1);
      return throwFakeResponse(config, { message: 'Zaposleni je obrisan.' });
    }
    return throwFakeError(config, 404, 'Zaposleni nije pronađen.');
  }

  if (method === 'get' && path === '/employees') {
    let filtered = [...FAKE_EMPLOYEES];
    if (params?.email)      filtered = filtered.filter(e => e.email.toLowerCase().includes(params.email.toLowerCase()));
    if (params?.first_name) filtered = filtered.filter(e => e.first_name.toLowerCase().includes(params.first_name.toLowerCase()));
    if (params?.last_name)  filtered = filtered.filter(e => e.last_name.toLowerCase().includes(params.last_name.toLowerCase()));
    if (params?.position)   filtered = filtered.filter(e => String(e.position_id).includes(params.position));

    const page     = Number(params?.page)      || 1;
    const pageSize = Number(params?.page_size)  || 20;
    const start    = (page - 1) * pageSize;
    const sliced   = filtered.slice(start, start + pageSize);

    return throwFakeResponse(config, {
      data:        sliced,
      total:       filtered.length,
      page,
      page_size:   pageSize,
      total_pages: Math.ceil(filtered.length / pageSize),
    });
  }

  if (method === 'get' && path === '/clients/search') {
    const q = params?.q?.toLowerCase() ?? '';
    const found = FAKE_CLIENTS.find(
      c => c.jmbg === q || c.email.toLowerCase() === q
    );
    if (found) return throwFakeResponse(config, found);
    return throwFakeError(config, 404, 'Klijent nije pronađen.');
  }

  if (method === 'post' && path === '/clients') {
    const novi = { id: Date.now(), ...data };
    FAKE_CLIENTS.push(novi);
    return throwFakeResponse(config, novi, 201);
  }

  if (method === 'post' && path === '/accounts') {
    const noviRacun = { id: Date.now(), ...data };
    FAKE_ACCOUNTS.push(noviRacun);
    return throwFakeResponse(config, noviRacun, 201);
  }

  if (method === 'get' && path === '/accounts') {
    return throwFakeResponse(config, { data: FAKE_ACCOUNTS, total: FAKE_ACCOUNTS.length });
  }

  return config;
});

function throwFakeResponse(config, responseData, status = 200) {
  config.adapter = () =>
    Promise.resolve({
      data:    responseData,
      status,
      headers: {},
      config,
      request: {},
    });
  return config;
}

function throwFakeError(config, status, errorMsg) {
  config.adapter = () =>
    Promise.reject({
      response: {
        status,
        data: { error: errorMsg },
      },
      config,
    });
  return config;
}
