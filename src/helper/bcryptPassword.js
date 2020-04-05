import bcrypt from 'bcryptjs/index';

class BcryptPassword {
  async bcryptHash(userPassword) {
    let salt, hashedPassword;
    try {
      salt = await bcrypt.genSalt(10);
      //console.log('salt', salt);
      hashedPassword = await bcrypt.hash(userPassword, salt);
      //console.log('promise hash', hashedPassword);
      return hashedPassword;
    } catch (e) {
      console.log(e);
      return false; // handleld inside controller .. to return err res
    }

    /*bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(userPassword, salt, (err, hash) => {
        if (err) throw err;
        console.log("hash", hash)
        hashPassword = hash;
        return hashPassword;
      });
    });*/
  }

  async comparePasswords(candidatePassword, userPasswordhash) {
    try {
      let compare = await bcrypt.compare(
        candidatePassword,
        userPasswordhash,
      );
      return compare;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
export const bcryptPassword = new BcryptPassword();
export default bcryptPassword;
