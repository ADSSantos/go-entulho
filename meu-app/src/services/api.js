export const enviarDadosParaMake = async (dados) => {
  try {
    const response = await fetch('https://hook.eu2.make.com/7s0qa3j5y9rnvch3lso4yjgmgprnvfmb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar dados.');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};