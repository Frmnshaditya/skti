/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "mahasiswa" | "dosen";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MahasiswaData {
  id?: string;
  userId: string;
  namaLengkap: string;
  nim: string;
  alamat: string;
  nomorTelepon: string;
  kelas: string;
  createdAt: string;
  updatedAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}
