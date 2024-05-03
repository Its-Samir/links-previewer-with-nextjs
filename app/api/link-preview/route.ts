import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function GET(req: NextRequest) {
	try {
		const searchParams = new URL(req.url).searchParams;
		const url = searchParams.get("url");

		if (!url) {
			return NextResponse.json({ message: "url required" }, { status: 400 });
		}

		const response = await axios.get(url);

		const dom = new JSDOM(`${response.data}`);

		const { document } = dom.window;

		const title = document.querySelector("title")?.text;

		const description = document
			.querySelector("meta[name=description]")
			?.getAttribute("content");

		const imageUrl = document
			.querySelector("meta[property='og:image']")
			?.getAttribute("content");

		if (!title || !description || !imageUrl) {
			return NextResponse.json(
				{ message: "Could not find data" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ title, description, imageUrl },
			{ status: 200 }
		);

	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
