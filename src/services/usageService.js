import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';

const DAILY_GENERATE_LIMIT = 3;
const DAILY_EDIT_LIMIT = 6;

export const checkGenerationLimit = async (userId) => {
  if (!userId) return { allowed: true };

  const today = new Date().toISOString().split('T')[0];
  const usageRef = doc(db, 'usage', userId);
  const usageSnap = await getDoc(usageRef);

  if (!usageSnap.exists()) {
    return { allowed: true, remaining: DAILY_GENERATE_LIMIT };
  }

  const data = usageSnap.data();
  if (data.lastGenerateDate !== today) {
    return { allowed: true, remaining: DAILY_GENERATE_LIMIT };
  }

  const count = data.generateCount || 0;
  return { 
    allowed: count < DAILY_GENERATE_LIMIT, 
    remaining: DAILY_GENERATE_LIMIT - count,
    nextReset: getNextResetTime()
  };
};

export const incrementGenerationCount = async (userId) => {
  if (!userId) return;
  const today = new Date().toISOString().split('T')[0];
  const usageRef = doc(db, 'usage', userId);
  const usageSnap = await getDoc(usageRef);

  if (!usageSnap.exists() || usageSnap.data().lastGenerateDate !== today) {
    await setDoc(usageRef, {
      lastGenerateDate: today,
      generateCount: 1
    }, { merge: true });
  } else {
    await updateDoc(usageRef, {
      generateCount: increment(1)
    });
  }
};

export const checkEditLimit = async (userId) => {
  if (!userId) return { allowed: false };

  const today = new Date().toISOString().split('T')[0];
  const usageRef = doc(db, 'usage', userId);
  const usageSnap = await getDoc(usageRef);

  if (!usageSnap.exists()) {
    return { allowed: true, remaining: DAILY_EDIT_LIMIT };
  }

  const data = usageSnap.data();
  if (data.lastEditDate !== today) {
    return { allowed: true, remaining: DAILY_EDIT_LIMIT };
  }

  const count = data.editCount || 0;
  return { 
    allowed: count < DAILY_EDIT_LIMIT, 
    remaining: DAILY_EDIT_LIMIT - count,
    nextReset: getNextResetTime()
  };
};

export const incrementEditCount = async (userId) => {
  if (!userId) return;
  const today = new Date().toISOString().split('T')[0];
  const usageRef = doc(db, 'usage', userId);
  const usageSnap = await getDoc(usageRef);

  if (!usageSnap.exists() || usageSnap.data().lastEditDate !== today) {
    await setDoc(usageRef, {
      lastEditDate: today,
      editCount: 1
    }, { merge: true });
  } else {
    await updateDoc(usageRef, {
      editCount: increment(1)
    });
  }
};

const getNextResetTime = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
};

export const getIpAddress = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch (e) {
    return 'unknown-ip';
  }
};

export const checkIpLimit = async (ip) => {
  const usageRef = doc(db, 'ip_usage', ip.replace(/\./g, '_'));
  const usageSnap = await getDoc(usageRef);
  
  if (!usageSnap.exists()) return { allowed: true };
  
  const data = usageSnap.data();
  const today = new Date().toISOString().split('T')[0];
  
  if (data.lastDate !== today) return { allowed: true };
  
  return { allowed: data.count < 1 };
};

export const incrementIpCount = async (ip) => {
  const key = ip.replace(/\./g, '_');
  const usageRef = doc(db, 'ip_usage', key);
  const today = new Date().toISOString().split('T')[0];
  
  await setDoc(usageRef, {
    lastDate: today,
    count: increment(1)
  }, { merge: true });
};
