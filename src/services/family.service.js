// ===================================================================================
// File: /src/services/family.service.js
// Purpose: Encapsulates all API calls related to family management.
// ===================================================================================
import api from './api';

const API_URL_FAM = '/family';

const createFamily = (familyName, userColor) => api.post(API_URL_FAM, { familyName, userColor });
const updateFamily = (familyData) => api.put(API_URL_FAM, familyData);
const getFamilyDetails = () => api.get(API_URL_FAM);
const getFamilyMembers = () => api.get(`${API_URL_FAM}/members`);
const addFamilyMember = (memberData) => api.post(`${API_URL_FAM}/members`, memberData);
const updateFamilyMember = (memberId, memberData) => api.put(`${API_URL_FAM}/members/${memberId}`, memberData);
const removeFamilyMember = (memberId) => api.delete(`${API_URL_FAM}/members/${memberId}`);
const joinFamily = (inviteCode, userColor) => api.post(`${API_URL_FAM}/join`, { inviteCode, userColor });

const FamilyService = { createFamily, updateFamily, getFamilyDetails, getFamilyMembers, addFamilyMember, updateFamilyMember, removeFamilyMember, joinFamily };
export default FamilyService;
