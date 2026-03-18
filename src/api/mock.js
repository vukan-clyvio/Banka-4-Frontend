import api from './client';

const DELAY = 600;

const delay = ms => new Promise(r => setTimeout(r, ms));


const FAKE_CLIENTS = [
  { id: 1,  first_name: 'Marija',     last_name: 'Ković',     email: 'marija.kovic@raf.rs',      phone: '+381601234567', address: 'Knez Mihailova 10, Beograd',      active: true  },
  { id: 2,  first_name: 'Nikola',     last_name: 'Savić',     email: 'nikola.savic@raf.rs',       phone: '+381602345678', address: 'Bulevar Oslobođenja 5, Novi Sad', active: true  },
  { id: 3,  first_name: 'Jelena',     last_name: 'Milić',     email: 'jelena.milic@raf.rs',     phone: '+381603456789', address: 'Nemanjina 15, Beograd',           active: true  },
  { id: 4,  first_name: 'Stefan',     last_name: 'Đorđević',  email: 'stefan.djordjevic@raf.rs',  phone: '+381604567890', address: 'Cara Dušana 20, Kragujevac',      active: false },
  { id: 5,  first_name: 'Ana',        last_name: 'Todorović', email: 'ana.todorovic@raf.rs',      phone: '+381605678901', address: 'Terazije 8, Beograd',             active: true  },
  { id: 6,  first_name: 'Miloš',      last_name: 'Petrović',  email: 'milos.petrovic@raf.rs',     phone: '+381606789012', address: 'Savska 30, Beograd',              active: true  },
  { id: 7,  first_name: 'Ivana',      last_name: 'Jovanović', email: 'ivana.jovanovic@raf.rs',    phone: '+381607890123', address: 'Vojvode Stepe 42, Beograd',       active: true  },
  { id: 8,  first_name: 'Aleksandar', last_name: 'Nikolić',   email: 'aleksandar.nikolic@raf.rs',       phone: '+381608901234', address: 'Balkanska 12, Beograd',           active: false },
  { id: 9,  first_name: 'Maja',       last_name: 'Stanković', email: 'maja.stankovic@raf.rs',     phone: '+381609012345', address: 'Obilićev venac 4, Beograd',       active: true  },
  { id: 10, first_name: 'Vladimir',   last_name: 'Marković',  email: 'vladimir.markovic@raf.rs',    phone: '+381610123456', address: 'Makedonska 22, Beograd',          active: true  },
];
const FAKE_ACCOUNTS = [
  { account_id: 'acc-1', account_number: '111-0001-000000001-11', name: 'Glavni tekući račun',   owner_id: 1, owner_name: 'Petar Petrović', account_type: 'PERSONAL', status: 'ACTIVE', currency: 'RSD', balance: 345000, available_balance: 330000, reserved_funds: 15000, daily_limit: 500000, monthly_limit: 5000000, created_at: '2024-06-15' },
  { account_id: 'acc-2', account_number: '111-0001-000000002-11', name: 'Štedni račun',          owner_id: 1, owner_name: 'Petar Petrović', account_type: 'PERSONAL', status: 'ACTIVE', currency: 'EUR', balance: 5200,   available_balance: 5200,   reserved_funds: 0,     daily_limit: 100000, monthly_limit: 1000000, created_at: '2024-08-01' },
  { account_id: 'acc-3', account_number: '111-0001-000000003-11', name: 'Poslovni račun',        owner_id: 1, owner_name: 'Petar Petrović', account_type: 'BUSINESS', status: 'ACTIVE', currency: 'RSD', balance: 1250000, available_balance: 1180000, reserved_funds: 70000, daily_limit: 2000000, monthly_limit: 20000000, created_at: '2024-03-20', company_name: 'TechCorp d.o.o.', pib: '123456789', mb: '12345678' },
  { account_id: 'acc-4', account_number: '111-0001-000000004-11', name: 'Devizni poslovni račun', owner_id: 1, owner_name: 'Petar Petrović', account_type: 'BUSINESS', status: 'ACTIVE', currency: 'EUR', balance: 24500,  available_balance: 22000,  reserved_funds: 2500,  daily_limit: 500000, monthly_limit: 5000000, created_at: '2024-05-10', company_name: 'TechCorp d.o.o.', pib: '123456789', mb: '12345678' },
];

const FAKE_TRANSACTIONS = [
  { transaction_id: 'txn-1',  account_id: 'acc-1', date: '2026-03-10T14:30:00', type: 'DEPOSIT',    amount: 85000,  currency: 'RSD', recipient_payer: 'TechCorp d.o.o.',   payment_code: '289', description: 'Uplata za mart' },
  { transaction_id: 'txn-2',  account_id: 'acc-1', date: '2026-03-08T09:15:00', type: 'WITHDRAWAL', amount: 12500,  currency: 'RSD', recipient_payer: 'EPS Distribucija',  payment_code: '221', description: 'Račun za struju' },
  { transaction_id: 'txn-3',  account_id: 'acc-1', date: '2026-03-05T16:45:00', type: 'WITHDRAWAL', amount: 3200,   currency: 'RSD', recipient_payer: 'Maxi DOO',          payment_code: '289', description: 'Kupovina' },
  { transaction_id: 'txn-4',  account_id: 'acc-1', date: '2026-03-01T10:00:00', type: 'DEPOSIT',    amount: 120000, currency: 'RSD', recipient_payer: 'RAF Banka',         payment_code: '240', description: 'Plata februar' },
  { transaction_id: 'txn-5',  account_id: 'acc-1', date: '2026-02-25T11:20:00', type: 'WITHDRAWAL', amount: 45000,  currency: 'RSD', recipient_payer: 'Stan Invest DOO',   payment_code: '290', description: 'Kirija' },
  { transaction_id: 'txn-6',  account_id: 'acc-2', date: '2026-03-01T08:00:00', type: 'DEPOSIT',    amount: 500,    currency: 'EUR', recipient_payer: 'Petar Petrović',    payment_code: '289', description: 'Uplata na štednju' },
  { transaction_id: 'txn-7',  account_id: 'acc-2', date: '2026-02-01T08:00:00', type: 'DEPOSIT',    amount: 500,    currency: 'EUR', recipient_payer: 'Petar Petrović',    payment_code: '289', description: 'Uplata na štednju' },
  { transaction_id: 'txn-8',  account_id: 'acc-3', date: '2026-03-12T13:00:00', type: 'DEPOSIT',    amount: 350000, currency: 'RSD', recipient_payer: 'Klijent ABC d.o.o.', payment_code: '289', description: 'Uplata po fakturi 2024-031' },
  { transaction_id: 'txn-9',  account_id: 'acc-3', date: '2026-03-09T10:30:00', type: 'WITHDRAWAL', amount: 180000, currency: 'RSD', recipient_payer: 'Dobavljač XYZ',     payment_code: '290', description: 'Plaćanje fakture' },
  { transaction_id: 'txn-10', account_id: 'acc-3', date: '2026-03-03T15:45:00', type: 'WITHDRAWAL', amount: 55000,  currency: 'RSD', recipient_payer: 'Poreska uprava',    payment_code: '254', description: 'PDV za februar' },
  { transaction_id: 'txn-11', account_id: 'acc-4', date: '2026-03-07T09:00:00', type: 'DEPOSIT',    amount: 8500,   currency: 'EUR', recipient_payer: 'EU Partner GmbH',   payment_code: '289', description: 'Invoice payment' },
  { transaction_id: 'txn-12', account_id: 'acc-4', date: '2026-03-02T14:00:00', type: 'WITHDRAWAL', amount: 3200,   currency: 'EUR', recipient_payer: 'Cloud Provider Inc', payment_code: '290', description: 'Monthly subscription' },
];

const FAKE_EMPLOYEE = {


  employee_id: 1,
  first_name: 'Petar',
  last_name: 'Petrović',
  email: 'petar.petrovic@rafbank.rs',
  username: 'ppetrovic',
  gender: 'M',
  date_of_birth: '1985-03-15',

  phone_number: '+381601234567',
  address: 'Knez Mihailova 10, Beograd',
  department: 'Management',
  position_id: 1,
  active: true,
  is_admin: true,
  permissions: [

    'employee.view',
    'employee.create',
    'employee.update',
    'employee.delete',
  ],

};

const FAKE_EMPLOYEES = [
    { employee_id: 1, first_name: 'Petar',   last_name: 'Petrović',  email: 'petar.petrovic@rafbank.rs',    username: 'ppetrovic',  position_id: 1, department: 'Management', active: true,  gender: 'M', date_of_birth: '1985-03-15', phone_number: '+381601234567', address: 'Knez Mihailova 10' },
    { employee_id: 2, first_name: 'Ana',     last_name: 'Jovanović', email: 'ana.jovanovic@rafbank.rs',     username: 'ajovanovic', position_id: 2, department: 'Finance',    active: true,  gender: 'F', date_of_birth: '1990-07-22', phone_number: '+381601234568', address: 'Bulevar Kralja Aleksandra 5' },
    { employee_id: 3, first_name: 'Marko',   last_name: 'Nikolić',   email: 'marko.nikolic@rafbank.rs',     username: 'mnikolic',   position_id: 3, department: 'IT',         active: true,  gender: 'M', date_of_birth: '1992-11-03', phone_number: '+381601234569', address: 'Nemanjina 15' },
    { employee_id: 4, first_name: 'Jelena',  last_name: 'Đorđević',  email: 'jelena.djordjevic@rafbank.rs', username: 'jdjordjevic', position_id: 4, department: 'Finance',    active: false, gender: 'F', date_of_birth: '1988-01-10', phone_number: '+381601234570', address: 'Cara Dušana 20' },
    { employee_id: 5, first_name: 'Stefan',  last_name: 'Popović',   email: 'stefan.popovic@rafbank.rs',    username: 'spopovic',   position_id: 5, department: 'IT',         active: true,  gender: 'M', date_of_birth: '1995-05-18', phone_number: '+381601234571', address: 'Terazije 8' },
    { employee_id: 6, first_name: 'Milica',  last_name: 'Stanković', email: 'milica.stankovic@rafbank.rs',  username: 'mstankovic', position_id: 6, department: 'HR',         active: true,  gender: 'F', date_of_birth: '1991-09-25', phone_number: '+381601234572', address: 'Savska 30' },
    { employee_id: 7, first_name: 'Nikola',  last_name: 'Ilić',      email: 'nikola.ilic@rafbank.rs',       username: 'nilic',      position_id: 7, department: 'IT',         active: false, gender: 'M', date_of_birth: '1993-12-07', phone_number: '+381601234573', address: 'Vojvode Stepe 42' },
    { employee_id: 8, first_name: 'Ivana',   last_name: 'Marković',  email: 'ivana.markovic@rafbank.rs',    username: 'imarkovic',  position_id: 8, department: 'Finance',    active: true,  gender: 'F', date_of_birth: '1989-04-14', phone_number: '+381601234574', address: 'Balkanska 12' },

];



const FAKE_RATES = [
    { code: 'EUR', flag: '/flags/eu.svg', buy: 116.8, mid: 117.2, sell: 117.6 },
    { code: 'CHF', flag: '/flags/ch.svg', buy: 120.1, mid: 120.7, sell: 121.3 },
    { code: 'USD', flag: '/flags/us.svg', buy: 107.5, mid: 108.0, sell: 108.5 },
    { code: 'GBP', flag: '/flags/gb.svg', buy: 135.2, mid: 136.0, sell: 136.8 },
    { code: 'JPY', flag: '/flags/jp.svg', buy: 0.72, mid: 0.74, sell: 0.76 },
    { code: 'CAD', flag: '/flags/ca.svg', buy: 79.5, mid: 80.0, sell: 80.5 },
    { code: 'AUD', flag: '/flags/au.svg', buy: 71.2, mid: 71.8, sell: 72.4 },
    { code: 'RSD', flag: '/flags/rs.svg', buy: 1, mid: 1, sell: 1 },
];


//EUR, CHF, USD, GBP, JPY, CAD, AUD

api.interceptors.request.use(async config => {
    await delay(DELAY);

    const { method, url, data: rawData, params } = config;
    const data = typeof rawData === 'string' ? JSON.parse(rawData || '{}') : rawData ?? {};
    const path = url?.replace(import.meta.env.VITE_API_URL ?? '', '') ?? '';

    if (method === 'post' && path === '/login') {
        if (data.email && data.password) {
            return throwFakeResponse(config, {
                token:         'fake-jwt-token-123',
                refresh_token: 'fake-refresh-token-123',
                user:          FAKE_EMPLOYEE,
            });
        }
        return throwFakeError(config, 401, 'Pogrešan email ili lozinka.');
    }

    if (method === 'post' && path === '/refresh') {
        return throwFakeResponse(config, {
            token:         'fake-jwt-token-123',
            refresh_token: 'fake-refresh-token-123',
        });
    }

    if (method === 'post' && path === '/register') {
        const novi = { employee_id: Date.now(), ...data };
        FAKE_EMPLOYEES.push(novi);
        return throwFakeResponse(config, { data: novi, message: 'Zaposleni je kreiran.' }, 201);
    }

    if (method === 'post' && path === '/activate') {
        return throwFakeResponse(config, { message: 'Nalog je aktiviran.' });
    }

    if (method === 'post' && path === '/forgot-password') {
        return throwFakeResponse(config, { message: 'Email je poslat.' });
    }

    if (method === 'post' && path === '/reset-password') {
        return throwFakeResponse(config, { message: 'Lozinka je promenjena.' });
    }

    if (method === 'post' && path === '/change-password') {
        return throwFakeResponse(config, { message: 'Lozinka je uspešno promenjena.' });
    }

    const idMatch = path.match(/^\/(\d+)$/);

    if (method === 'get' && idMatch) {
        const emp = FAKE_EMPLOYEES.find(e => e.employee_id === Number(idMatch[1]));
        if (emp) {
            return throwFakeResponse(config, { data: emp });
        }
        return throwFakeError(config, 404, 'Zaposleni nije pronađen.');
    }

    if (method === 'patch' && idMatch) {
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

    if (method === 'get' && path === '/exchange/rates') {
        return throwFakeResponse(config, FAKE_RATES);
    }

    if (method === 'get' && path === '') {
        let filtered = [...FAKE_EMPLOYEES];

        if (params?.email) {
            filtered = filtered.filter(e => e.email.toLowerCase().includes(params.email.toLowerCase()));
        }
        if (params?.first_name) {
            filtered = filtered.filter(e => e.first_name.toLowerCase().includes(params.first_name.toLowerCase()));
        }
        if (params?.last_name) {
            filtered = filtered.filter(e => e.last_name.toLowerCase().includes(params.last_name.toLowerCase()));
        }
        if (params?.position) {
            filtered = filtered.filter(e => String(e.position_id).includes(params.position));
        }

        const page      = Number(params?.page)      || 1;
        const pageSize  = Number(params?.page_size)  || 20;
        const start     = (page - 1) * pageSize;
        const sliced    = filtered.slice(start, start + pageSize);

        return throwFakeResponse(config, {
            data:        sliced,
            total:       filtered.length,
            page,
            page_size:   pageSize,
            total_pages: Math.ceil(filtered.length / pageSize),
        });
    }

    return config;

api.interceptors.request.use(async config => {
    await delay(DELAY);

    const { method, url, data: rawData, params } = config;
    const data = typeof rawData === 'string' ? JSON.parse(rawData || '{}') : rawData ?? {};
    const path = url?.replace(import.meta.env.VITE_API_URL ?? '', '') ?? '';




  if (method === 'post' && path === '/login') {
    if (data.email && data.password) {
      return throwFakeResponse(config, {
        token: 'fake-jwt-token-123',
        refresh_token: 'fake-refresh-token-123',
        user: FAKE_EMPLOYEE,
      });
    }
    return throwFakeError(config, 401, 'Pogrešan email ili lozinka.');
  }

]  // CLIENT LOGIN
  if (method === 'post' && path === '/client/login') {
    if (data.email && data.password) {
      const client = FAKE_CLIENTS.find(c => c.email === data.email);
      if (client && data.password) { // U produkciji bi se proveravala prava lozinka
        return throwFakeResponse(config, {
          user: {
            id: client.id,
            first_name: client.first_name,
            last_name: client.last_name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            role: 'client' // Važno: označava da je klijent
          },
          token: 'fake-client-jwt-token-456',
          refresh_token: 'fake-client-refresh-token-789'
        });
      }
    }
    return throwFakeError(config, 401, 'Pogrešan email ili lozinka.');
  }

  // EMPLOYEE LOGIN (stari endpoint koji vraća employee podatke)
  if (method === 'post' && path === '/login') {
    if (data.email && data.password) {
      const employee = FAKE_EMPLOYEES.find(e => e.email === data.email);
      if (employee && data.password) {
        return throwFakeResponse(config, {
          user: {
            employee_id: employee.employee_id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            username: employee.username,
            position_id: employee.position_id,
            department: employee.department,
            role: 'employee', // Važno: označava da je zaposleni
            permissions: ['employee.view', 'employee.create', 'employee.edit', 'employee.delete', 'client.view']
          },
          token: 'fake-employee-jwt-token-123',
          refresh_token: 'fake-employee-refresh-token-456'
        });
      }
    }
    return throwFakeError(config, 401, 'Pogrešan email ili lozinka.');
  }

  if (method === 'post' && path === '/auth/register') {

  if (method === 'post' && path === '/refresh') {
    return throwFakeResponse(config, {

      token: 'fake-jwt-token-123',

      refresh_token: 'fake-refresh-token-123',
    });
  }

  if (method === 'post' && path === '/register') {
    const novi = { employee_id: Date.now(), ...data };
    FAKE_EMPLOYEES.push(novi);
    return throwFakeResponse(config, { data: novi, message: 'Zaposleni je kreiran.' }, 201);
  }

  if (method === 'post' && path === '/activate') {
    return throwFakeResponse(config, { message: 'Nalog je aktiviran.' });
  }

  if (method === 'post' && path === '/forgot-password') {
    return throwFakeResponse(config, { message: 'Email je poslat.' });
  }

  if (method === 'post' && path === '/reset-password') {
    return throwFakeResponse(config, { message: 'Lozinka je promenjena.' });
  }

  if (method === 'post' && path === '/change-password') {
    return throwFakeResponse(config, { message: 'Lozinka je uspešno promenjena.' });
  }

  const idMatch = path.match(/^\/(\d+)$/);

  if (MOCK_ENABLED) {
    if (method === 'post' && path === '/auth/login') {
      if (data.email && data.password) {
        const isClient = data.email.includes('client');
        return throwFakeResponse(config, {
          token:         'fake-jwt-token-123',
          refresh_token: 'fake-refresh-token-456',
          user: {
            id:            1,
            identity_type: isClient ? 'CLIENT' : 'EMPLOYEE',
            first_name:    'Petar',
            last_name:     'Petrović',
            email:         data.email,
            username:      'ppetrovic',
            permissions:   isClient ? [] : ['employee.view', 'employee.create', 'employee.update', 'employee.delete'],
          },
        });
      }
      return throwFakeError(config, 401, 'Pogrešan email ili lozinka.');
    }


  if (method === 'patch' && idMatch) {
    const idx = FAKE_EMPLOYEES.findIndex(e => e.employee_id === Number(idMatch[1]));
    if (idx !== -1) {
      Object.assign(FAKE_EMPLOYEES[idx], data);
      return throwFakeResponse(config, { data: FAKE_EMPLOYEES[idx], message: 'Zaposleni je ažuriran.' });

    if (method === 'post' && path === '/clients/register') {
      const novi = { employee_id: Date.now(), ...data };
      FAKE_EMPLOYEES.push(novi);
      return throwFakeResponse(config, { data: novi, message: 'Zaposleni je kreiran.' }, 201);
    }

    if (method === 'post' && path === '/auth/activate') {
      return throwFakeResponse(config, { message: 'Nalog je aktiviran.' });
    }

    if (method === 'post' && path === '/auth/forgot-password') {
      return throwFakeResponse(config, { message: 'Email je poslat.' });
    }

    if (method === 'post' && path === '/auth/reset-password') {
      return throwFakeResponse(config, { message: 'Lozinka je promenjena.' });
    }

    if (method === 'post' && path === '/auth/change-password') {
      return throwFakeResponse(config, { message: 'Lozinka je uspešno promenjena.' });
    }

    const idMatch = path.match(/^\/employees\/(\d+)$/);


    if (method === 'get' && idMatch) {
      const emp = FAKE_EMPLOYEES.find(e => e.employee_id === Number(idMatch[1]));
      if (emp) {
        return throwFakeResponse(config, { data: emp });
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

 
  if (method === 'get' && path === '') {
    let filtered = [...FAKE_EMPLOYEES];

    if (method === 'get' && path === '/employees') {
      let filtered = [...FAKE_EMPLOYEES];

      if (params?.email) {
        filtered = filtered.filter(e => e.email.toLowerCase().includes(params.email.toLowerCase()));
      }
      if (params?.first_name) {
        filtered = filtered.filter(e => e.first_name.toLowerCase().includes(params.first_name.toLowerCase()));
      }
      if (params?.last_name) {
        filtered = filtered.filter(e => e.last_name.toLowerCase().includes(params.last_name.toLowerCase()));
      }
      if (params?.position) {
        filtered = filtered.filter(e => String(e.position_id).includes(params.position));
      }

      const page      = Number(params?.page)      || 1;
      const pageSize  = Number(params?.page_size)  || 20;
      const start     = (page - 1) * pageSize;
      const sliced    = filtered.slice(start, start + pageSize);

      return throwFakeResponse(config, {
        data:        sliced,
        total:       filtered.length,
        page,
        page_size:   pageSize,
        total_pages: Math.ceil(filtered.length / pageSize),
      });

    }
  }


    const page = Number(params?.page) || 1;
    const pageSize = Number(params?.page_size) || 20;
    const start = (page - 1) * pageSize;
    const sliced = filtered.slice(start, start + pageSize);

    return throwFakeResponse(config, {
      data: sliced,
      total: filtered.length,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(filtered.length / pageSize),
    });

  if (MOCK_ACCOUNTS && method === 'get' && path === '/accounts') {
    return throwFakeResponse(config, { data: FAKE_ACCOUNTS });
  }

  if (MOCK_ACCOUNTS) {
    const accTxMatch = path.match(/^\/accounts\/([\w-]+)\/transactions$/);
    if (method === 'get' && accTxMatch) {
      const txns = FAKE_TRANSACTIONS.filter(t => t.account_id === accTxMatch[1]);
      return throwFakeResponse(config, { data: txns });
    }

    const accIdMatch = path.match(/^\/accounts\/([\w-]+)$/);
    if (method === 'get' && accIdMatch) {
      const acc = FAKE_ACCOUNTS.find(a => a.account_id === accIdMatch[1]);
      if (acc) return throwFakeResponse(config, { data: acc });
      return throwFakeError(config, 404, 'Račun nije pronađen.');
    }

  }


  if (method === 'get' && path === '') {
    let filtered = [...FAKE_EMPLOYEES];

  // --- MOCK LOGIKA ZA PLACANJA ---
  if (path === '/payments' && method === 'get') {
    let filtered = [...FAKE_PAYMENTS];

    // LOG ZA DEBUG (Otvori F12 i vidi šta piše ovde!)
    console.log("Parametri koji su stigli na Mock:", params);


    // 1. Tip
    if (params?.type) {
      filtered = filtered.filter(p => p.type === params.type);
    }

    // 2. Status
    if (params?.status && params.status !== "") {
      filtered = filtered.filter(p => p.status === params.status);
    }

    // 3. Iznos MIN (npr. ako uneseš -5000, prikazaće -4200 jer je -4200 > -5000)
    if (params?.amountFrom && params.amountFrom !== "") {
      const min = Number(params.amountFrom);
      filtered = filtered.filter(p => p.amount >= min);
    }

    // 4. Iznos MAX (npr. ako uneseš -1000, sakriće sve što je "skuplje" od toga)
    if (params?.amountTo && params.amountTo !== "") {
      const max = Number(params.amountTo);
      filtered = filtered.filter(p => p.amount <= max);
    }

    // 5. Datumi (Isto provera za prazne stringove)
    if (params?.dateFrom && params.dateFrom !== "") {
      filtered = filtered.filter(p => new Date(p.date) >= new Date(params.dateFrom));
    }
    if (params?.dateTo && params.dateTo !== "") {
      const dTo = new Date(params.dateTo);
      dTo.setHours(23, 59, 59);
      filtered = filtered.filter(p => new Date(p.date) <= dTo);
    }

    // Paginacija...
    const page = Number(params?.page) || 1;
    const pageSize = Number(params?.page_size) || 20;
    const start = (page - 1) * pageSize;
    const sliced = filtered.slice(start, start + pageSize);

    return throwFakeResponse(config, {
      data: sliced,
      total: filtered.length,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(filtered.length / pageSize),
    });
  }

  // Dobavljanje jedne transakcije po ID-u (za Modal)
  const paymentIdMatch = path.match(/^\/payments\/(\d+)$/);
  if (method === 'get' && paymentIdMatch) {
    const payment = FAKE_PAYMENTS.find(p => p.id === Number(paymentIdMatch[1]));
    if (payment) return throwFakeResponse(config, { data: payment });
    return throwFakeError(config, 404, 'Transakcija nije pronađena.');
  }

  return config;

});

function throwFakeResponse(config, responseData, status = 200) {

  config.adapter = () =>
    Promise.resolve({
      data: responseData,
      status,
      headers: {},
      config,
      request: {},
});
  return config;

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