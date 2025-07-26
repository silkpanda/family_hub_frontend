import api from './api'; // This import only works if this file is in the same folder as api.js

const API_URL = '/family';

// Create a new family during onboarding
const createFamily = (familyName, userColor) => {
  return api.post(API_URL, { familyName, userColor });
};

// Update the family's details (e.g., name)
const updateFamily = (familyData) => {
  return api.put(API_URL, familyData);
};

// Get details for the logged-in user's family
const getFamilyDetails = () => {
  return api.get(API_URL);
};

// Get a list of all members in the family
const getFamilyMembers = () => {
  return api.get(`${API_URL}/members`);
};

// Add a new member to the family
const addFamilyMember = (memberData) => {
  return api.post(`${API_URL}/members`, memberData);
};

// Update an existing family member
const updateFamilyMember = (memberId, memberData) => {
  return api.put(`${API_URL}/members/${memberId}`, memberData);
};

// Remove a member from the family
const removeFamilyMember = (memberId) => {
  return api.delete(`${API_URL}/members/${memberId}`);
};

// Join an existing family with an invite code
const joinFamily = (inviteCode, userColor) => {
  return api.post(`${API_URL}/join`, { inviteCode, userColor });
};


const FamilyService = {
  createFamily,
  updateFamily,
  getFamilyDetails,
  getFamilyMembers,
  addFamilyMember,
  updateFamilyMember,
  removeFamilyMember,
  joinFamily,
};

export default FamilyService;
