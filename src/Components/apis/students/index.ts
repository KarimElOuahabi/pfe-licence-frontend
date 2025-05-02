export const getStudents = async () => {
    const response = await fetch(`http://localhost:8080/students`);
    const data = await response.json();
    return data;
  };
  
  export const deleteStudent = async (id: number) => {
    const response = await fetch(`http://localhost:8080/students/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete student');
    }
  };