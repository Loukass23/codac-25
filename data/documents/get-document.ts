import { DocumentDiscussion, DocumentComment, Document, User } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";


export type DocumentDiscussionWithComments = DocumentDiscussion & {
    comments: (DocumentComment & { user: User })[],
    user: User
};

export const getDocumentById = async (docId: string) => {
    return await prisma.document.findUnique({
        where: {
            id: docId,
        },
    }) as Document;
}
export const getDocumentDiscussionsByDocumentId = async (docId: string) => {
    return await prisma.documentDiscussion.findMany({
        where: {
            documentId: docId,
        },
        include: {
            comments: {
                include: {
                    user: true,
                },
            },
            user: true,
        },
    }) as DocumentDiscussionWithComments[];
}