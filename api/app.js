const express = require('express');
const bodyParser = require('body-parser');
const {Sequelize, DataTypes} = require('sequelize');
const crypto = require('crypto');
const firebaseStorage = require('firebase/storage');
const firebaseApp = require('firebase/app');
const firebaseDatabase = require('firebase/database');
const cors = require('cors')
const tesseract = require("node-tesseract-ocr")
const fs = require("fs")
const pdf2img = require('pdf-img-convert');

const firebaseConfig = {
  apiKey: "AIzaSyCF5sHsekhEe-_y7s0Hha_NIAjmE8JK42A",
  authDomain: "docxpress-77939.firebaseapp.com",
  projectId: "docxpress-77939",
  storageBucket: "docxpress-77939.appspot.com",
  messagingSenderId: "989267613866",
  appId: "1:989267613866:web:d988bfcfd503aa101418d3",
  measurementId: "G-Z1T50F1JDL"
};

// Initialize Firebase
const firebase = firebaseApp.initializeApp(firebaseConfig);
firebaseDatabase.getDatabase(firebase);

const getFiles = async (fileTypes) => {
  const storage = firebaseStorage.getStorage();
  const files = [];
  for (const fileType of fileTypes) {
    const storageRef = firebaseStorage.ref(storage, `files/${fileType}`);
    const list = await firebaseStorage.listAll(storageRef);
    for (const item of list.items) {
      files.push({filename: item.name, type: fileType, url: await firebaseStorage.getDownloadURL(item)});
    }
  }
  return files;
};

const app = express();

app.use(cors())

app.use(bodyParser.urlencoded({extended: true}));

// Configurer Sequelize avec SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'ephemeral_links.db',
  logging: false,
});

// Définir le modèle EphemeralLink
const EphemeralLink = sequelize.define('EphemeralLink', {
  linkId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    unique: true,
  },
  targetUrl: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  expirationTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

sequelize.sync().then(() => console.log('Database synchronized'));

app.post('/create', async (req, res) => {
  const {target_url, expiration_minutes} = req.body;

  if (!target_url || !expiration_minutes) {
    res.status(400).send('Invalid Body');
  }

  const linkId = crypto.randomBytes(4).toString('hex'); // Génère un ID de lien unique
  const expirationTime = new Date(Date.now() + expiration_minutes * 60 * 1000);

  try {
    await EphemeralLink.create({linkId, targetUrl: target_url, expirationTime});

    const ephemeralLink = `${req.protocol}://${req.get('host')}/${linkId}`;
    res.send(`${ephemeralLink}`);
  } catch (error) {
    console.error(error);
    res.status(400).send('Invalid Body');
  }
});

app.get('/getWorkingEphemeralLinks', async (req, res) => {
  const ephemeralLinks = await EphemeralLink.findAll({})

  const workingLinks = ephemeralLinks.filter((ephemeralLink) =>
    ephemeralLink && new Date() < new Date(ephemeralLink.expirationTime)
  )

  res.send(workingLinks);
})

app.get('/getEphemeralLinks', async (req, res) => {
  const ephemeralLinks = await EphemeralLink.findAll({})

  res.send(ephemeralLinks);
})

app.get('/passports', async (req, res) => {
  res.send(await getFiles(['passport']));
});

app.get('/id_cards', async (req, res) => {
  res.send(await getFiles(['id_card']));
});

app.get('/:linkId', async (req, res) => {
  const {linkId} = req.params;
  const link = await EphemeralLink.findOne({where: {linkId}});

  if (link && new Date() < new Date(link.expirationTime)) {
    res.redirect(link.targetUrl);
  } else {
    res.status(404).send('This link has expired or does not exist.');
  }
});

app.use(
  bodyParser.raw({limit: '50mb', type: ['image/*']})
);

app.post('/ocr', async (req, res) => {
  try {
    const body = req.body;
    fs.writeFileSync("file.pdf", body);

    let notPdf = false;
    let outputImages2;
    try {
      outputImages2 = await pdf2img.convert('file.pdf');
    } catch (e) {
      console.log(e);
      notPdf = true;
    }

    fs.writeFileSync("image.png", !notPdf ? outputImages2[0] : body);

    const config = {
      lang: "eng",
      oem: 1,
      psm: 3,
    }

    let textFound;
    await tesseract
      .recognize("image.png", config)
      .then((text) => {
        textFound = text;
        console.log("Result:", text)
      })
      .catch((error) => {
        console.log(error.message)
      })

    textFound = textFound.toLowerCase();

    // Find "carte" or "identite" or "passport" in the text
    if (textFound.includes("carte") || textFound.includes("identite")) {
      res.send("id_card");
      return;
    }

    if (textFound.includes("passport") || textFound.includes("passeport")) {
      res.send("passport");
      return;
    }
  } catch (e) {
    console.log(e);
  }

  res.send("other");
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

app.use(express.static('public'));
