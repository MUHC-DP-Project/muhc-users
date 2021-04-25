const { assert, expect } = require("chai");
const chai = require("chai");
const mongoose = require('mongoose');
const connection = require('mongoose').connection;
const { exit } = require('process');
require('dotenv').config();
const {sample_user1} = require("./sample_user");
let baseUrl = "http://localhost:8081/auth/signUp/";
let baseUrlUser= "http://localhost:8081/users/";
let baseUrlLogin= "http://localhost:8081/auth/signIn/";
let baseurlPassword = "http://localhost:8081/auth/passwordReset"
let baseurlForgotPassword = "http://localhost:8081/auth/forgotPassword"

let token = 'some_authorization_token';

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let sampleId = 1;

before(async() => {
    const MONGO_DB_URI = process.env.MONGO_TEST_DB_URI;
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };
    const resp = await mongoose.connect(MONGO_DB_URI, options); 
});

after(async() => {
    mongoose.disconnect();
    mongoose.connection.close();
});

afterEach(async() => {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany({});
    }
})

describe('App',function(){
    it('first test', function(){
        assert.equal(true, true);
    });
});

describe("create a user", () => {
    it("return the user JSON", async () => {
        return chai.request(baseUrl)
            .post("")
            .send(sample_user1)
            .then((res) => {
                expect(res).to.have.status(200);
                sampleId = res.body._id;
                assert.exists(res.body._id);
            }).catch(err =>{
                console.log(JSON.stringify(err));
                assert.fail();
        });
    })
});

describe("GET a user", () => {
    it('logs in the user', async() => {
        return chai.request(baseUrlLogin)
        .post("")
        .send({"email":"egekarakartal@gmail.com","password":"asda"})
        
        .then((res) => {
            expect(res).to.have.status(200);
            sampleId=res.body["user"]["_id"]
            token=res.body["token"]
            
        }).catch(err =>{
            console.log(JSON.stringify(err));

    });
        

    });
    it('should return a list of logged in user', async() => {
        return chai.request(baseUrlUser).get("" + sampleId)
        .set({ "Authorization": `Bearer ${token}` })
        .then((res) => {
            expect(res).to.have.status(200);
        }).catch( (err) => {
            console.log(JSON.stringify(err));
        })
    })
});

describe("Changing password", () => {
    it('changes password', async() => {
        return chai.request(baseurlPassword)
        .post("")
        .set({ "Authorization": `Bearer ${token}` })
        .send({"oldPassword":"asda","newPassword":"asda1"})
        .send({"oldPassword":"asda1","newPassword":"asda"})
        .then((res) => {
            expect(res).to.have.status(200);
                    
        }).catch(err =>{
            console.log(JSON.stringify(err));

    })
    })
});


describe("Forgot password", () => {
    it('changes password', async() => {
        return chai.request(baseurlForgotPassword)
        .post("")
        .send({"email":"egekarakartal@gmail.com"})
        .then((res) => {
            expect(res).to.have.status(200);
                    
        }).catch(err =>{
            console.log(JSON.stringify(err));

    })
    })
});



