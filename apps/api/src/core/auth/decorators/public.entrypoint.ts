import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_ENTRYPOINT = 'public_entrypoint';

export const PublicEntrypoint = () => SetMetadata(IS_PUBLIC_ENTRYPOINT, true);