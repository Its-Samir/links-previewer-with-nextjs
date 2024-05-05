"use client";

import axios, { AxiosResponse } from "axios";
import { useState } from "react";

interface PreviewData {
	title: string;
	description: string;
	imageUrl: string;
}

export default function LinkPreview() {
	const [previewData, setPreviewData] = useState<PreviewData | null>(null);
	const [url, setUrl] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const fetchData = async () => {
		setPreviewData(null);

		if (!url || url === "") {
			setError("Url required");
			return;
		}

		if (!url.startsWith("http")) {
			setError("Not a valid url structure");
			return;
		}
		
		setLoading(true);

		try {
			const response = await axios.get(
				`http://localhost:3000/api/link-preview?url=${url}`
			);
			const { data }: AxiosResponse<PreviewData> = response;

			setPreviewData(data);
		} catch (error: any) {
			setError("Preview not found");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center space-y-5">
			<h1 className="text-2xl text-clip bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 font-sans font-bold">
				LinkPreviewer: Preview Web Links with Ease.
			</h1>
			<div className="rounded-full p-1 border-black border-4 w-full md:w-[30rem] text-slate-500 flex items-center justify-between">
				<input
					type="text"
					value={url}
					className="flex-1 px-1 md:px-2 rounded-full w-auto md:w-[30rem] focus:outline-none"
					onChange={(e) => setUrl(e.target.value)}
					placeholder="Enter url"
				/>
				<button
					onClick={fetchData}
					className="px-4 md:px-7 py-3 border-none bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full cursor-pointer hover:from-purple-700 hover:to-blue-700"
				>
					Fetch
				</button>
			</div>
			<div className="flex items-center justify-center p-4 border">
				{!previewData && !loading && !error ? (
					<h1 className="text-2xl text-clip bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 font-sans font-bold">
						Take a quick look into links.
					</h1>
				) : null}
				{previewData ? (
					<div className="flex flex-col w-auto md:w-[30rem] rounded-sm space-y-2">
						<div className="flex flex-col text-slate-500 space-y-3">
							<h1 className="text-2xl font-sans font-bold text-neutral-800">
								<a href={url} target="_blank">
									{previewData.title}
								</a>
							</h1>
							<p>
								<a href={url} target="_blank">
									{previewData.description}
								</a>
							</p>
						</div>
						<img
							className="w-auto max-h-[20rem] rounded-md"
							src={previewData.imageUrl}
							alt={previewData.title}
						/>
					</div>
				) : null}
				{loading && !previewData ? (
					<div className="animate-spin w-[4rem] h-[4rem] bg-transparent border-0 border-black border-l-2 border-t-2 rounded-full" />
				) : null}
				{error && !loading && !previewData ? (
					<h1 className="text-2xl text-clip bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 font-sans font-bold">
						{error}
					</h1>
				) : null}
			</div>
		</div>
	);
}
