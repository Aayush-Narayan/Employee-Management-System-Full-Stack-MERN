import bcrypt from 'bcrypt';
const email = "alice.patel@example.com";
const plain = 'Alice@123';
const hash  = bcrypt.hashSync(plain, 8);
console.log(hash);
