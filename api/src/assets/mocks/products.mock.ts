import { v4 as uuidv4 } from "uuid";

export enum ProductStatus {
  PENDING = "pending",
  SHIPPING = "shipping",
  SUCCESS = "success",
  FAILED = "failed",
}

export interface IProduct {
  id: string;
  code: string;
  name: string;
  supplier: string;
  status: ProductStatus;
  amount: number;
  stock: number;
  stock_warning: number;
  unit: string;
}

export const productLists: IProduct[] = [
  {
    id: uuidv4(),
    amount: 887.85,
    status: ProductStatus.PENDING,
    code: "IMPS 29740 WAL",
    name: "ลูกสูบ+สลัก MAHLE, Isu 4JA1 ปีกยาว STD,8-97942-997",
    supplier: "เสรีวัฒนา เอนเทอไฟรซ",
    stock: 2,
    stock_warning: 1,
    unit: "ชิ้น",
  },
  {
    id: uuidv4(),
    amount: 768.0,
    status: ProductStatus.PENDING,
    code: "SDN 31038",
    name: "ชาร์ปก้าน SDN31038ZX STD,Nissan TD25 0=4.0",
    supplier: "เสรีวัฒนา เอนเทอไฟรซ",
    stock: 1,
    stock_warning: 2,
    unit: "ชิ้น",
  },
  {
    id: uuidv4(),
    amount: 420.56,
    status: ProductStatus.PENDING,
    code: "M200A",
    name: "ช้าพอก M200A STD,BD25",
    supplier: "เสรีวัฒนา เอนเทอไฟรซ",
    stock: 1,
    stock_warning: 2,
    unit: "ชิ้น",
  },
  {
    id: uuidv4(),
    amount: 385.51,
    status: ProductStatus.PENDING,
    code: "M9106A",
    name: "ช้าพอก M9106A STD, 1ZR-FB 2ZR-FB 3ZR-FE",
    supplier: "เสรีวัฒนา เอนเทอไฟรซ",
    stock: 1,
    stock_warning: 1,
    unit: "ชิ้น",
  },
  {
    id: uuidv4(),
    amount: 350.47,
    status: ProductStatus.PENDING,
    code: "R9500A1",
    name: "ช้าพอก R9500A1 STD, 1ZR-FB 2ZR-FB 3ZR-FE",
    supplier: "เสรีวัฒนา เอนเทอไฟรซ",
    stock: 1,
    stock_warning: 2,
    unit: "ชิ้น",
  },
  {
    id: uuidv4(),
    amount: 10,
    status: ProductStatus.PENDING,
    code: "8GD 187 560-011",
    name: "หลอดไฟท้าย 1 จุด 21W 12V (93)",
    supplier: "ทรู ออโตโมทีฟ",
    stock: 20,
    stock_warning: 15,
    unit: "ชิ้น",
  },
  {
    id: uuidv4(),
    amount: 611.33,
    status: ProductStatus.PENDING,
    code: "GDB3425AT",
    name: "ผ้าเบรคหน้า Altis 08-19, Sienta 16>",
    supplier: "ทรู ออโตโมทีฟ",
    stock: 2,
    stock_warning: 1,
    unit: "ชิ้น",
  },
  {
    id: uuidv4(),
    amount: 550.19,
    status: ProductStatus.PENDING,
    code: "378019SP",
    name: "โช๊ค หลัง, ISU D-max 2WD ปี 2002-10",
    supplier: "ทรู ออโตโมทีฟ",
    stock: 2,
    stock_warning: 1,
    unit: "ชิ้น",
  },
  {
    id: uuidv4(),
    amount: 392.52,
    status: ProductStatus.PENDING,
    code: "JBJ320",
    name: "ลูกหมากปีกนกล่าง ซ/ข TFR 4WD,, Dmax 2WD",
    supplier: "ทรู ออโตโมทีฟ",
    stock: 2,
    stock_warning: 2,
    unit: "ชิ้น",
  },
];
