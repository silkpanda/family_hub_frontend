// --- File: /frontend/src/services/family.service.js ---
// Provides API functions for managing family data.

import api from './api';

const API_URL_FAM = '/family';

const createFamily = (familyName, userColor) => api.post(API_URL_FAM, { familyName, userColor }).then(res => res.data);
const updateFamily = (familyData) => api.put(API_URL_FAM, familyData).then(res => res.data);
const getFamilyDetails = () => api.get(API_URL_FAM).then(res => res.data);
const addFamilyMember = (memberData) => api.post(`${API_URL_FAM}/members`, memberData).then(res => res.data);
const updateFamilyMember = (memberId, memberData) => api.put(`${API_URL_FAM}/members/${memberId}`, memberData).then(res => res.data);
const removeFamilyMember = (memberId) => api.delete(`${API_URL_FAM}/members/${memberId}`).then(res => res.data);
const joinFamily = (inviteCode, userColor) => api.post(`${API_URL_FAM}/join`, { inviteCode, userColor }).then(res => res.data);
const setMemberPin = (memberId, pin) => api.patch(`${API_URL_FAM}/members/${memberId}/set-pin`, { pin });

const FamilyService = { createFamily, updateFamily, getFamilyDetails, addFamilyMember, updateFamilyMember, removeFamilyMember, joinFamily, setMemberPin };
export default FamilyService;