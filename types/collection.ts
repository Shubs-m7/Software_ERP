import * as z from "zod"

export const collectionSchema = z.object({
  date: z.string().min(1, "Date is required."),
  projectId: z.string().min(1, "Please select a project."),
  shiftA: z.number().min(0).default(0),
  shiftB: z.number().min(0).default(0),
  shiftC: z.number().min(0).default(0),
  etc: z.number().min(0).default(0),
  posOnline: z.number().min(0).default(0),
  monthlyPass: z.number().min(0).default(0),
  otherCash: z.number().min(0).default(0),
  otherUPI: z.number().min(0).default(0),
  otherBankPhone: z.number().min(0).default(0),
  overloadCollection: z.number().min(0).default(0),
  remarks: z.string().optional(),
})

export type CollectionFormValues = z.infer<typeof collectionSchema>

export interface CollectionEntry extends CollectionFormValues {
  id: string
  totalCash: number
  totalUPI: number
  grandTotal: number
}
