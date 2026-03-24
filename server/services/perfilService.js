exports.getProfile = async(supabase, userId) => {
  const {data, error} = await supabase
  .from('profile_public')
  .select('*')
  .eq('id', userId)
  .select();

  if (error) throw error;
  return data;
}

exports.updatePerfil = async(supabase, userId, fields) => { 
    const { data, error } = await supabase
    .from('perfil')
    .update(fields)
    .eq('id', userId)
    .select();
    if (error) throw error;
    return data;
}

