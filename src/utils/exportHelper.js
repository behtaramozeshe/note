import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export const exportToWord = (title, content) => {
  if (!content) return;

  const paragraphs = content.split("\n").map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line, size: 24, font: "Tahoma" })],
        bidirectional: true,
      })
  );

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 32,
                font: "Tahoma",
              }),
            ],
            bidirectional: true,
          }),
          new Paragraph({ text: "" }), // Gap
          ...paragraphs,
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${title}.docx`);
  });
};
