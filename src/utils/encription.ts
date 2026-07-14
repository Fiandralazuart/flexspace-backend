import bcrypt from "bcrypt";

export const encrypt = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const compare = async (
	password: string,
	hashedPassword: string,
): Promise<boolean> => {
	return await bcrypt.compare(password, hashedPassword);
};
