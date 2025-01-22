import axios from "axios";

const API_URL = "http://localhost:8080";

//リスト 一覧取得 (GET)
export const fetchListsAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/lists`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lists:", error);
    return [];
  }
}

//リスト 新規作成 (POST)
export const createListAPI = async (title: string) => {
  try {
    const response = await axios.post(`${API_URL}/list`, {title});
    return response.data;
  } catch (error) {
    console.error("Error creating new list:", error);
  }
}

//リスト タイトル編集(PUT)
export const editListAPI = async (id: number, title: string) => {
  try {
    const response = await axios.put(`${API_URL}/list/${id}`, { title });
    return response.data;
  } catch (error) {
    console.error("Error editing list:", error);
  }
}

//リスト 削除(DELETE)
export const deleteListAPI = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/list/${id}`);
  } catch (error) {
    console.error("Error deleting list:", error);
  }
}
