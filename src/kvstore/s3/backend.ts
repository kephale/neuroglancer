/**
 * @license
 * Copyright 2025 Google Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { SharedKvStoreContextCounterpart } from "#src/kvstore/backend.js";
import type { DriverListOptions, ListResponse } from "#src/kvstore/index.js";
import { proxyList } from "#src/kvstore/proxy.js";
import { ReadableS3KvStore } from "#src/kvstore/s3/common.js";

export class S3KvStore extends ReadableS3KvStore<SharedKvStoreContextCounterpart> {
  list(prefix: string, options: DriverListOptions): Promise<ListResponse> {
    return proxyList(this.sharedKvStoreContext, this.getUrl(prefix), options);
  }
}
