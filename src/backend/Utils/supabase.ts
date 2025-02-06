import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env["SUPABASE_URL"] as string,
	process.env["SUPABASE_ANON_KEY"] as string,
);

const uploadImageToSupabase = async (filePath: any, buffer: any, mimetype: any) => {
	const { error } = await supabase.storage
		.from("images") // 'images' is the bucket name
		.upload(filePath, buffer, {
			contentType: mimetype,
		});

	if (error) {
		throw new Error(error.message);
	}

	const { data: publicURL } = await supabase.storage
		.from("images")
		.getPublicUrl(filePath);

	return { publicURL: publicURL.publicUrl, filePath: filePath };
};

const deleteImageFromSupabase = async ({ filePath }: { filePath: any }) => {
	const { error } = await supabase.storage.from("images").remove([filePath]);
	if (error) {
		throw new Error(error.message);
	}
};

export { uploadImageToSupabase, deleteImageFromSupabase };
