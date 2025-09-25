import { DocumentDiscussion, DocumentComment, Document, User } from "@prisma/client";
import { Value } from "platejs";

import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";


export type DocumentDiscussionWithComments = DocumentDiscussion & {
    comments: (DocumentComment & { user: User })[],
    user: User
};

export type DocumentWithPlateContent = Omit<Document, 'content'> & {
    content: Value;
    navTitle?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    access?: string | null;
    order?: number | null;
    prev?: string | null;
    next?: string | null;
    slug?: string | null;
};

export const getDocumentById = async (docId: string): Promise<DocumentWithPlateContent> => {
    const document = await prisma.document.findUnique({
        where: {
            id: docId,
        },
    });

    if (!document) {
        notFound();
    }

    return {
        ...document,
        content: document.content as Value
    };
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