import { NextResponse } from 'next/server';

import type { RequestData } from '@app/api/request/schema';

import { convert } from 'postman-code-generators';
import { HeaderList, Request as PostmanRequest } from 'postman-collection';

const GENERATOR_OPTIONS = {
  indentCount: 3,
  indentType: 'Space',
  trimRequestBody: true,
  followRedirect: true,
};

export async function POST(request: Request) {
  const clientData: RequestData & { language: string; variant: string } =
    await request.json();
  const { url, method, headers, body, language, variant } = clientData;

  const postmanRequest = new PostmanRequest({
    url: url ?? 'https://dummyjson.com/test',
    method: method ?? 'GET',
    headers: new HeaderList(),
    body: body ?? '',
  });

  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      postmanRequest.addHeader({ key, value });
    });
  }

  return new Promise<NextResponse>((resolve) => {
    convert(
      language,
      variant,
      postmanRequest,
      GENERATOR_OPTIONS,
      (err, snippet) => {
        if (err) {
          resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ language, variant, snippet }));
        }
      },
    );
  });
}
