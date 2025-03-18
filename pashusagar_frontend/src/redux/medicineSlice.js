import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchMedicines = createAsyncThunk("medicines/fetchMedicines", async () => {
  const response = await axios.get("http://127.0.0.1:8000/api/products/")
  return response.data
})

export const addMedicine = createAsyncThunk("medicines/addMedicine", async (medicineData) => {
  const response = await axios.post("http://127.0.0.1:8000/api/products/", medicineData)
  return response.data
})

export const updateMedicine = createAsyncThunk("medicines/updateMedicine", async ({ id, medicineData }) => {
  const response = await axios.put(`http://127.0.0.1:8000/api/products/${id}/`, medicineData)
  return response.data
})

export const deleteMedicine = createAsyncThunk("medicines/deleteMedicine", async (id) => {
  await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`)
  return id
})

const medicineSlice = createSlice({
  name: "medicines",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(addMedicine.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
  },
})

export default medicineSlice.reducer

