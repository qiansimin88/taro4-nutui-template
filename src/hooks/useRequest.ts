/**
 * Re-export ahooks useRequest with extended functionality
 *
 * This module extends ahooks' useRequest to work seamlessly with our request.ts
 * All error handling, loading states, and token management are handled in request.ts
 *
 * Usage examples:
 *
 * 1. Basic usage:
 * ```ts
 * const { data, loading, error, run } = useRequest(getUserInfo, {
 *   manual: true
 * });
 * ```
 *
 * 2. With debounce:
 * ```ts
 * const { data, loading, run } = useRequest(searchUsers, {
 *   debounceWait: 300,
 *   manual: true
 * });
 * ```
 *
 * 3. With polling:
 * ```ts
 * const { data, loading } = useRequest(getStatus, {
 *   pollingInterval: 3000,
 *   pollingWhenHidden: false
 * });
 * ```
 *
 * 4. With cache:
 * ```ts
 * const { data, loading } = useRequest(getUserInfo, {
 *   cacheKey: 'user-info',
 *   staleTime: 60000 // 1 minute
 * });
 * ```
 *
 * 5. With retry:
 * ```ts
 * const { data, loading } = useRequest(fetchData, {
 *   retryCount: 3,
 *   retryInterval: 1000
 * });
 * ```
 *
 * 6. With dependencies refresh:
 * ```ts
 * const { data } = useRequest(getUserInfo, {
 *   refreshDeps: [userId],
 *   refreshDepsAction: () => {
 *     console.log('userId changed, refetching...');
 *   }
 * });
 * ```
 */

export { useRequest, useRequest as default } from "ahooks";

// Re-export types for convenience
export type {
  Options as UseRequestOptions,
  Result as UseRequestResult,
} from "ahooks/lib/useRequest/src/types";
