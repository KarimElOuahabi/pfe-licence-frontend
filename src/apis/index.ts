const create = async (url: string, body: any): Promise<any> => {
  try {
    const result = await fetch(`http://localhost:8080/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await result.json();
    return data;
  } catch (error) {
    console.error(`"Error creating data for ${url}"`, error);
    throw error;
  }
};

const update = async (url: string, body: any): Promise<any> => {
  try {
    const result = await fetch(`http://localhost:8080/${url}/${body.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error(`Error updating data for ${url} , id = ${body.id}`, error);
    throw error;
  }
};

const remove = async (url: string, id: number): Promise<number> => {
  try {
    const result = await fetch(`http://localhost:8080/${url}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!result.ok) {
      throw new Error(`Failed to delete item with id ${id}`);
    }
    return id; // Return the id of the deleted item
  } catch (error) {
    console.error(`"Error removing data for ${url} , id = ${id}"`, error);
    throw error;
  }
};

const getList = async (url: string, param?: string | number): Promise<any> => {
  try {
    let basicUrl = `http://localhost:8080/${url}`;
    if (param) {
      basicUrl += `/${param}`;
    }
    const result = await fetch(basicUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    return data;
  } catch (error) {
    console.error(`"Error listing data for ${url}"`, error);
    throw error;
  }
};

const getOne = async (url: string, id: number): Promise<any> => {
  try {
    const result = await fetch(`http://localhost:8080/${url}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    return data;
  } catch (error) {
    console.error(`"Error listing data by Id for ${url}"`, error);
    throw error;
  }
};

const getOneWithMultipleIds = async (customUrl: string): Promise<any> => {
  try {
    const result = await fetch(`http://localhost:8080/${customUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    return data;
  } catch (error) {
    console.error(`"Error listing data by Id for ${customUrl}"`, error);
    throw error;
  }
};

const createWithFile = async (
  url: string,
  formData: FormData
): Promise<any> => {
  try {
    const result = await fetch(`http://localhost:8080/${url}`, {
      method: "POST",
      // Don't set Content-Type — browser will handle it
      body: formData,
    });
    const data = await result.json();
    return data;
  } catch (error) {
    console.error(`Error creating data with file for ${url}`, error);
    throw error;
  }
};

const updateWithFile = async (
  url: string,
  formData: FormData
): Promise<any> => {
  try {
    // Assuming formData includes the id field
    const id = formData.get("id");
    const result = await fetch(`http://localhost:8080/${url}/${id}`, {
      method: "PUT",
      body: formData,
    });
    const data = await result.json();
    return data;
  } catch (error) {
    console.error(`Error updating data with file for ${url}`, error);
    throw error;
  }
};

export const API = {
  create,
  update,
  remove,
  getList,
  getOne,
  getOneWithMultipleIds,
  createWithFile,
  updateWithFile,
};
