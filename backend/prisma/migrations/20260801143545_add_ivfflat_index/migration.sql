-- Create IVFFLAT index for cosine similarity search
CREATE INDEX document_chunk_embedding_idx ON "DocumentChunk" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);