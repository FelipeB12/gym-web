const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!userInfo || !userInfo.token) {
    console.error('No authentication token found');
    return;
  }

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    
    const response = await axios.put(
      'http://localhost:5002/api/users/profile', 
      formData,
      config
    );
    
    // Handle successful response
    console.log('Profile updated successfully:', response.data);
    
  } catch (error) {
    console.error('Error updating profile:', error);
    // Add more specific error handling
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  }
} 