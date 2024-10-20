import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  ObjectType,
  InsertObjectData,
  UpdateObjectData,
  ManageObjectResponse,
} from '../types';

// Асинхронные экшены для управления объектами
export const fetchObjects = createAsyncThunk<ObjectType[]>(
  'objects/fetchObjects',
  async () => {
    const response = await axios.get<{ objects: ObjectType[] }>(
      'http://localhost:8000/objects_list',
    );
    return response.data.objects;
  },
);

export const addObject = createAsyncThunk<
  ManageObjectResponse,
  InsertObjectData
>('objects/addObject', async (newObject) => {
  const response = await axios.post<ManageObjectResponse>(
    'http://localhost:8000/manage_object',
    {
      operation_type: 'insert',
      data: newObject,
    },
  );
  return response.data;
});

export const updateObject = createAsyncThunk<
  { response: ManageObjectResponse; object: UpdateObjectData },
  UpdateObjectData
>('objects/updateObject', async (updatedObject) => {
  const response = await axios.post<ManageObjectResponse>(
    'http://localhost:8000/manage_object',
    {
      operation_type: 'update',
      data: updatedObject,
    },
  );
  return {
    response: response.data,
    object: updatedObject,
  };
});

export const deleteObject = createAsyncThunk<ManageObjectResponse, number>(
  'objects/deleteObject',
  async (objectId) => {
    const response = await axios.post<ManageObjectResponse>(
      'http://localhost:8000/manage_object',
      {
        operation_type: 'delete',
        data: { object_id: objectId },
      },
    );
    return response.data;
  },
);

interface ObjectsState {
  objects: ObjectType[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  response: ManageObjectResponse | null;
}

const initialState: ObjectsState = {
  objects: [],
  status: 'idle',
  error: null,
  response: null,
};

const objectsSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    clearResponse(state) {
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Objects
      .addCase(fetchObjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchObjects.fulfilled,
        (state, action: PayloadAction<ObjectType[]>) => {
          state.status = 'succeeded';
          state.objects = action.payload;
        },
      )
      .addCase(fetchObjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Неизвестная ошибка';
      })
      // Add Object
      .addCase(
        addObject.fulfilled,
        (state, action: PayloadAction<ManageObjectResponse>) => {
          state.response = action.payload;
          if (action.payload.object_instance) {
            state.objects.push(action.payload.object_instance);
          }
        },
      )
      // Update Object
      .addCase(
        updateObject.fulfilled,
        (
          state,
          action: PayloadAction<{
            response: ManageObjectResponse;
            object: UpdateObjectData;
          }>,
        ) => {
          state.response = action.payload.response;

          if (action.payload.object.object_id !== undefined) {
            const index = state.objects.findIndex(
              (obj) => obj.object_id === action.payload.object.object_id,
            );
            if (index !== -1) {
              state.objects[index] = action.payload.object;
            }
          }
        },
      )
      // Delete Object
      .addCase(
        deleteObject.fulfilled,
        (state, action: PayloadAction<ManageObjectResponse>) => {
          state.response = action.payload;
          if (action.payload.object_id !== undefined) {
            state.objects = state.objects.filter(
              (obj) => obj.object_id !== action.payload.object_id,
            );
          }
        },
      );
  },
});

export const { clearResponse } = objectsSlice.actions;

export default objectsSlice.reducer;
