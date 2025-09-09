const mongoose = require("mongoose");
require('dotenv').config();

const Connect = () => {
    const mongoDB = `${process.env.MONGO}`;

    main().catch((err) => console.log(err));
    async function main() {
        await mongoose.connect(mongoDB);
    }
}

exports.Connect= Connect
