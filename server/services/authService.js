const { supabase } = require('../supabase');

exports.signUp = async ({ email, password, ...metadata }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  if (error) throw error;
  return data;
};

exports.signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

exports.resendConfirmation = async (email) => {
  await supabase.auth.resend({ email, type: 'signup' });
};







