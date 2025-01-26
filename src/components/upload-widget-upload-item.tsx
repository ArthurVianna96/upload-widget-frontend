import * as Progress from "@radix-ui/react-progress";
import { Download, ImageUp, Link2, RefreshCcw, X } from "lucide-react";
import { motion } from "motion/react";
import { type Upload, useUploads } from "../store/uploads";
import { downloadUrl } from "../utils/download-url";
import { formatBytes } from "../utils/format-bytes";
import { Button } from "./ui/button";

export function UploadWidgetUploadItem(props: {
	upload: Upload;
	uploadId: string;
}) {
	const { cancelUpload, retryUpload } = useUploads();

	const progress = Math.min(
		props.upload.compressedSizeInBytes
			? Math.round((props.upload.uploadSizeInBytes * 100) / props.upload.compressedSizeInBytes)
			: 0,
		100,
	);

	console.log(props.upload.status);
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="p-3 rounded-lg flex flex-col gap-3 shadow-shape-content bg-white/2 relative overflow-hidden"
		>
			<div className="flex flex-col gap-1">
				<span className="text-xs font-medium flex items-center gap-1">
					<ImageUp className="size-3 text-zinc-300" strokeWidth={1.5} />
					<span className="max-w-[180px] truncate">{props.upload.name}</span>
				</span>

				<span className="text-xxs text-zinc-400 flex gap-1.5 items-center">
					<span className="line-through">{formatBytes(props.upload.originalSizeInBytes)}</span>
					<Circle />
					<span>
						{formatBytes(props.upload.compressedSizeInBytes || 0)}
						{props.upload.compressedSizeInBytes && (
							<span className="text-green-400 ml-1">
								-
								{Math.round(
									((props.upload.originalSizeInBytes - props.upload.compressedSizeInBytes) * 100) /
										props.upload.originalSizeInBytes,
								)}
								%
							</span>
						)}
					</span>
					<Circle />
					{props.upload.status === "success" && <span>100%</span>}
					{props.upload.status === "progress" && <span>{progress}%</span>}
					{props.upload.status === "error" && <span className="text-red-400">Error</span>}
					{props.upload.status === "canceled" && <span className="text-amber-400">Canceled</span>}
				</span>
			</div>

			<Progress.Root
				data-status={props.upload.status}
				value={progress}
				className="group bg-zinc-800 rounded-full overflow-hidden h-1"
			>
				<Progress.Indicator
					className="bg-indigo-500 h-1 group-data-[status=canceled]:bg-amber-500 group-data-[status=success]:bg-green-500 group-data-[status=error]:bg-red-500 transition-all"
					style={{
						width: props.upload.status === "progress" ? `${progress}%` : "100%",
					}}
				/>
			</Progress.Root>

			<div className="absolute top-2.5 right-2.5 flex items-center gap-1">
				<Button
					size="icon-sm"
					disabled={!props.upload.remoteUrl}
					onClick={() => downloadUrl(props.upload.remoteUrl as string)}
				>
					<Download className="size-4" strokeWidth={1.5} />
					<span className="sr-only">Download compressed image</span>
				</Button>

				<Button
					size="icon-sm"
					disabled={props.upload.status !== "success"}
					onClick={() =>
						props.upload.remoteUrl && navigator.clipboard.writeText(props.upload.remoteUrl)
					}
				>
					<Link2 className="size-4" strokeWidth={1.5} />
					<span className="sr-only">Copy remote url</span>
				</Button>

				<Button
					size="icon-sm"
					disabled={!["error", "canceled"].includes(props.upload.status)}
					onClick={() => retryUpload(props.uploadId)}
				>
					<RefreshCcw className="size-4" strokeWidth={1.5} />
					<span className="sr-only">Retry upload</span>
				</Button>

				<Button
					size="icon-sm"
					disabled={props.upload.status !== "progress"}
					onClick={() => cancelUpload(props.uploadId)}
				>
					<X className="size-4" strokeWidth={1.5} />
					<span className="sr-only">Cancel upload</span>
				</Button>
			</div>
		</motion.div>
	);
}

const Circle = () => <div className="size-1 rounded-full bg-zinc-700" />;
