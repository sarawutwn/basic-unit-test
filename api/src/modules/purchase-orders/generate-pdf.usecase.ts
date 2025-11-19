import PdfPrinter from "pdfmake";
import type { TableCell, TDocumentDefinitions } from "pdfmake/interfaces";
import { GetPresignedUrlUseCase } from "../cloudflare-r2/get-presigned-url.usecase";
import { v4 as uuidv4 } from "uuid";
import GetSignedUrlUseCase from "../cloudflare-r2/get-signed-url.usecase";
import dayjs from "dayjs";
import {
  NotoSansThaiRegular,
  NotoSansThaiBold,
} from "../../assets/fonts/noto-thai";

const fonts = {
  NotoSansThai: {
    normal: Buffer.from(NotoSansThaiRegular),
    bold: Buffer.from(NotoSansThaiBold),
  },
};

interface IProduct {
  name: string;
  code: string;
  amount: number;
  unit: string;
}

interface IPurchaseOrder {
  id: string;
  purchase_date: string;
  purchase_order_supplier: string;
  purchase_order_no: string;
  purchase_items: IProduct[];
}

export class GeneratePdfUseCase {
  async execute(purchaseOrder: IPurchaseOrder): Promise<string> {
    // generate pdf object
    const printer = new PdfPrinter(fonts);
    const docDefinition = await this.generatePDFObject(purchaseOrder);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const pdfBuffer = await this.generatePDFBuffer(pdfDoc);

    // put object pdf to r2
    const key = `/purchase-orders/${uuidv4()}.pdf`;
    await this.putObjectPdfToR2(key, pdfBuffer);

    // get signed url from r2
    const getSignedUrlUseCase = new GetSignedUrlUseCase();
    return getSignedUrlUseCase.execute(key);
  }

  async putObjectPdfToR2(key: string, pdfBuffer: Buffer): Promise<void> {
    const getPresignedUrlUseCase = new GetPresignedUrlUseCase();
    const presignedUrl = await getPresignedUrlUseCase.execute(key);
    await fetch(presignedUrl, {
      method: "PUT",
      body: pdfBuffer,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(pdfBuffer.length),
      },
    });
  }

  async generatePDFBuffer(pdfDoc: PDFKit.PDFDocument): Promise<Buffer> {
    const chunks: Buffer[] = [];
    return new Promise<Buffer>((resolve, reject) => {
      pdfDoc.on("data", (c) => chunks.push(c));
      pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
      pdfDoc.on("error", reject);
      pdfDoc.end();
    });
  }

  async generatePDFObject(
    purchaseOrder: IPurchaseOrder
  ): Promise<TDocumentDefinitions> {
    const purchaseItems = purchaseOrder.purchase_items.map((item) => [
      {
        text: item.name,
        fontSize: 10,
      },
      { text: item.code, alignment: "center", fontSize: 10 },
      {
        text: item.amount + " " + item.unit,
        alignment: "right",
        fontSize: 10,
      },
    ]);

    return {
      pageSize: "A4",
      pageMargins: [20, 40, 20, 0],
      defaultStyle: {
        font: "NotoSansThai",
        fontSize: 12,
      },
      content: [
        {
          text: "ใบสั่งซื้อ / PURCHASE ORDER",
          style: "title",
          fontSize: 14,
          margin: [180, 0, 0, 0],
        },
        {
          text: `วันที่ ${dayjs(purchaseOrder.purchase_date).format("DD MMM YYYY")}`,
          fontSize: 9,
          margin: [0, -16, 0, 0],
        },
        {
          text: `เลขที่ใบสั่งซื้อ : ${purchaseOrder.purchase_order_no}`,
          fontSize: 9,
          alignment: "right",
          margin: [0, -14, 0, 0],
        },
        {
          text: "ผู้สั่งซื้อ   หจก. ศรีสะเกษกลการ",
          fontSize: 10,
          margin: [0, 6, 0, 0],
        },
        {
          text: "โทร. 081-9557466",
          fontSize: 10,
          alignment: "right",
          margin: [0, -14, 0, 0],
        },
        {
          text: `เรียน      ${purchaseOrder.purchase_order_supplier}`,
          fontSize: 10,
          margin: [0, 2, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto"],
            body: [
              [
                {
                  text: "รายการสั่งซื้อสินค้า",
                  style: "tableHeader",
                  alignment: "center",
                },
                { text: "เบอร์แท้", style: "tableHeader", alignment: "center" },
                {
                  text: "จำนวน",
                  style: "tableHeader",
                  alignment: "right",
                },
              ],
              ...(purchaseItems as TableCell[][]),
            ],
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0 ? "#F2F2F2" : null,
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
          margin: [0, 0, 0, 12],
        },
      ],
      styles: {
        title: {
          fontSize: 16,
          bold: true,
        },
        tableHeader: {
          bold: true,
        },
      },
      info: {
        title: "ตัวอย่างเอกสาร A4 (pdfmake + Noto Sans Thai)",
        author: "GeneratePdfUseCase",
        subject: "A4 sample with Thai font",
      },
    };
  }
}

export default GeneratePdfUseCase;
