import bcrypt from 'bcrypt';

const password = 'Admin@4sjss';
const hash = bcrypt.hashSync(password, 10);
console.log('Password hash:', hash);
