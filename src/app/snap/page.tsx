import EnhancedUrlSnapper from "@/components/snap/UrlSnapper";

export default async function SnapPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <EnhancedUrlSnapper />
        </div>
    );
}