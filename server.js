import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());

const manifest = {
    url: "https://MarkZhebelev.github.io/testingTaskWithTon.github.io",
    name: "Test Project",
    iconUrl: "https://ton-connect.github.io/demo-dapp-with-react-ui/apple-touch-icon.png",
    network: "testnet"
};

app.get('/tonconnect-manifest.json', (req, res) => {
    res.json(manifest);
});

app.listen(port, () => {
    console.log(`Local server running at http://localhost:${port}`);
});