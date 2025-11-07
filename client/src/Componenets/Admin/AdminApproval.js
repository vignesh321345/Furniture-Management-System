useEffect(() => {
  axios.get('/api/admin/pending', { headers: { Authorization: `Bearer ${token}` } })
    .then(res => setPendingAdmins(res.data));
}, []);

const approveAdmin = (id) => {
  axios.patch(`/api/admin/approve/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } })
    .then(() => fetchPendingAdmins());
};