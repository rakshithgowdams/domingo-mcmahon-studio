import { useGSAP } from "@gsap/react";

/**
 * Thin pass-through alias for `useGSAP` so the rest of the codebase can
 * import a single hook name (`useGsapAnimation`) and we keep one place
 * to evolve scope/context conventions in the future.
 *
 * Usage is identical to useGSAP — see https://gsap.com/resources/React/
 */
export const useGsapAnimation = useGSAP;
export default useGsapAnimation;
