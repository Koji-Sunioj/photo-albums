export const checkRequest = async (request: Response) => {
  if (!request.ok) {
    const { message } = await request.json();
    throw new Error(message);
  }
};
