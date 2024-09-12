import express from "express";
import bodyParser from "body-parser"
import PDFDocument from 'pdfkit';
import fs from 'fs';

const app=express();
const port=3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs");
});
var invoice=6611930;

app.post("/",(req,res)=>{
    const { name, date, visa, amount, inWord } = req.body; // Extract data from body

    // Create a new PDF document
    const doc = new PDFDocument();
    const regularFont = 'public/Adamina-Regular.ttf';


    // Pipe the PDF to a file
    var fileName = `output.pdf`;
    if(name!=''){
    fileName = `${name}_Bill.pdf`;
}
    doc.pipe(fs.createWriteStream(fileName));

    doc.fontSize(15).text(`SAI TRAVEL SERVICES
C-714,UNITY COMLEX-V.P.G ROAD,
Andheri(W),
MUMBAI-400058`);
doc.moveDown();

    
    doc.fontSize(12).font(regularFont).text('INVOICE', {
        align: 'center'
    }).underline(275, 148, 60, 27, { color: 'black' });

    doc.moveDown();

    doc.text(`Invoice No.:      ${invoice++}`);
    doc.text(`Invoice Date:     ${date}`);
    doc.moveDown();

    doc.text(`Received thanks from :     ${name}`);
    doc.moveDown();
    doc.text(`the sum of Rs.${amount}       ${inWord}`);
    doc.moveDown();
    
    doc.fontSize(15).text(`By Cash Against ${visa}-normal`);
    doc.moveDown();
    doc.moveDown();
    doc.rect(200,365, 250, 25).strokeColor('#D3D3D3').stroke();
    doc.rect(250,408, 100, 25).strokeColor('#D3D3D3').stroke();

    doc.text(`For SAI TRAVEL SERVICES`,{
        align: 'center',
    });
    doc.moveDown();
    doc.text(`Signature`,{
        align: 'center'
    });

    doc.end();

    
    res.download(fileName, (err) => {
        if (err) {
            res.status(500).send("Could not generate the PDF.");
        }
    });
    //res.render("index.ejs");
});

app.listen(port,()=>{
    console.log(`${port} Listening`)
});