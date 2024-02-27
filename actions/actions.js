"use server";
export async function sendNewMessage(_, formData) {
  console.log("Seding new message...");
  console.log(formData);
  return { message: "success" };
}
