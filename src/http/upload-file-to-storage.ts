import axios from "axios";

interface UploadFileToStorageDTO {
	file: File;
	onProgress: (sizeInBytes: number) => void;
}

interface UploadFileToStorageOptions {
	signal?: AbortSignal;
}

export async function uploadToStorage(
	{ file, onProgress }: UploadFileToStorageDTO,
	options?: UploadFileToStorageOptions,
) {
	const data = new FormData();

	data.append("file", file);

	const response = await axios.post<{
		url: string;
	}>("http://localhost:3333/uploads", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		signal: options?.signal,
		onUploadProgress(progressEvent) {
			onProgress(progressEvent.loaded);
		},
	});

	return response.data.url;
}
