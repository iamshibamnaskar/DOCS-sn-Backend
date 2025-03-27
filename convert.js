var adminjson = {
}


const firebaseString = JSON.stringify(adminjson)
  .replace(/\\n/g, '\\\\n');

console.log("✅ Copy the following to your .env file:\n");
console.log(firebaseString);
