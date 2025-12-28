var ze=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function se(a){return a&&a.__esModule&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a}var b={exports:{}},n={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var K;function ce(){if(K)return n;K=1;var a=Symbol.for("react.transitional.element"),_=Symbol.for("react.portal"),h=Symbol.for("react.fragment"),y=Symbol.for("react.strict_mode"),C=Symbol.for("react.profiler"),m=Symbol.for("react.consumer"),k=Symbol.for("react.context"),R=Symbol.for("react.forward_ref"),u=Symbol.for("react.suspense"),t=Symbol.for("react.memo"),f=Symbol.for("react.lazy"),T=Symbol.for("react.activity"),O=Symbol.iterator;function w(e){return e===null||typeof e!="object"?null:(e=O&&e[O]||e["@@iterator"],typeof e=="function"?e:null)}var z={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},I=Object.assign,q={};function A(e,r,s){this.props=e,this.context=r,this.refs=q,this.updater=s||z}A.prototype.isReactComponent={},A.prototype.setState=function(e,r){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,r,"setState")},A.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function U(){}U.prototype=A.prototype;function $(e,r,s){this.props=e,this.context=r,this.refs=q,this.updater=s||z}var x=$.prototype=new U;x.constructor=$,I(x,A.prototype),x.isPureReactComponent=!0;var Y=Array.isArray;function H(){}var l={H:null,A:null,T:null,S:null},V=Object.prototype.hasOwnProperty;function P(e,r,s){var o=s.ref;return{$$typeof:a,type:e,key:r,ref:o!==void 0?o:null,props:s}}function ee(e,r){return P(e.type,r,e.props)}function j(e){return typeof e=="object"&&e!==null&&e.$$typeof===a}function te(e){var r={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(s){return r[s]})}var G=/\/+/g;function L(e,r){return typeof e=="object"&&e!==null&&e.key!=null?te(""+e.key):r.toString(36)}function re(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(H,H):(e.status="pending",e.then(function(r){e.status==="pending"&&(e.status="fulfilled",e.value=r)},function(r){e.status==="pending"&&(e.status="rejected",e.reason=r)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function M(e,r,s,o,c){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var d=!1;if(e===null)d=!0;else switch(i){case"bigint":case"string":case"number":d=!0;break;case"object":switch(e.$$typeof){case a:case _:d=!0;break;case f:return d=e._init,M(d(e._payload),r,s,o,c)}}if(d)return c=c(e),d=o===""?"."+L(e,0):o,Y(c)?(s="",d!=null&&(s=d.replace(G,"$&/")+"/"),M(c,r,s,"",function(ue){return ue})):c!=null&&(j(c)&&(c=ee(c,s+(c.key==null||e&&e.key===c.key?"":(""+c.key).replace(G,"$&/")+"/")+d)),r.push(c)),1;d=0;var E=o===""?".":o+":";if(Y(e))for(var v=0;v<e.length;v++)o=e[v],i=E+L(o,v),d+=M(o,r,s,i,c);else if(v=w(e),typeof v=="function")for(e=v.call(e),v=0;!(o=e.next()).done;)o=o.value,i=E+L(o,v++),d+=M(o,r,s,i,c);else if(i==="object"){if(typeof e.then=="function")return M(re(e),r,s,o,c);throw r=String(e),Error("Objects are not valid as a React child (found: "+(r==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":r)+"). If you meant to render a collection of children, use an array instead.")}return d}function N(e,r,s){if(e==null)return e;var o=[],c=0;return M(e,o,"","",function(i){return r.call(s,i,c++)}),o}function ne(e){if(e._status===-1){var r=e._result;r=r(),r.then(function(s){(e._status===0||e._status===-1)&&(e._status=1,e._result=s)},function(s){(e._status===0||e._status===-1)&&(e._status=2,e._result=s)}),e._status===-1&&(e._status=0,e._result=r)}if(e._status===1)return e._result.default;throw e._result}var B=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var r=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(r))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},oe={map:N,forEach:function(e,r,s){N(e,function(){r.apply(this,arguments)},s)},count:function(e){var r=0;return N(e,function(){r++}),r},toArray:function(e){return N(e,function(r){return r})||[]},only:function(e){if(!j(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};return n.Activity=T,n.Children=oe,n.Component=A,n.Fragment=h,n.Profiler=C,n.PureComponent=$,n.StrictMode=y,n.Suspense=u,n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=l,n.__COMPILER_RUNTIME={__proto__:null,c:function(e){return l.H.useMemoCache(e)}},n.cache=function(e){return function(){return e.apply(null,arguments)}},n.cacheSignal=function(){return null},n.cloneElement=function(e,r,s){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var o=I({},e.props),c=e.key;if(r!=null)for(i in r.key!==void 0&&(c=""+r.key),r)!V.call(r,i)||i==="key"||i==="__self"||i==="__source"||i==="ref"&&r.ref===void 0||(o[i]=r[i]);var i=arguments.length-2;if(i===1)o.children=s;else if(1<i){for(var d=Array(i),E=0;E<i;E++)d[E]=arguments[E+2];o.children=d}return P(e.type,c,o)},n.createContext=function(e){return e={$$typeof:k,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:m,_context:e},e},n.createElement=function(e,r,s){var o,c={},i=null;if(r!=null)for(o in r.key!==void 0&&(i=""+r.key),r)V.call(r,o)&&o!=="key"&&o!=="__self"&&o!=="__source"&&(c[o]=r[o]);var d=arguments.length-2;if(d===1)c.children=s;else if(1<d){for(var E=Array(d),v=0;v<d;v++)E[v]=arguments[v+2];c.children=E}if(e&&e.defaultProps)for(o in d=e.defaultProps,d)c[o]===void 0&&(c[o]=d[o]);return P(e,i,c)},n.createRef=function(){return{current:null}},n.forwardRef=function(e){return{$$typeof:R,render:e}},n.isValidElement=j,n.lazy=function(e){return{$$typeof:f,_payload:{_status:-1,_result:e},_init:ne}},n.memo=function(e,r){return{$$typeof:t,type:e,compare:r===void 0?null:r}},n.startTransition=function(e){var r=l.T,s={};l.T=s;try{var o=e(),c=l.S;c!==null&&c(s,o),typeof o=="object"&&o!==null&&typeof o.then=="function"&&o.then(H,B)}catch(i){B(i)}finally{r!==null&&s.types!==null&&(r.types=s.types),l.T=r}},n.unstable_useCacheRefresh=function(){return l.H.useCacheRefresh()},n.use=function(e){return l.H.use(e)},n.useActionState=function(e,r,s){return l.H.useActionState(e,r,s)},n.useCallback=function(e,r){return l.H.useCallback(e,r)},n.useContext=function(e){return l.H.useContext(e)},n.useDebugValue=function(){},n.useDeferredValue=function(e,r){return l.H.useDeferredValue(e,r)},n.useEffect=function(e,r){return l.H.useEffect(e,r)},n.useEffectEvent=function(e){return l.H.useEffectEvent(e)},n.useId=function(){return l.H.useId()},n.useImperativeHandle=function(e,r,s){return l.H.useImperativeHandle(e,r,s)},n.useInsertionEffect=function(e,r){return l.H.useInsertionEffect(e,r)},n.useLayoutEffect=function(e,r){return l.H.useLayoutEffect(e,r)},n.useMemo=function(e,r){return l.H.useMemo(e,r)},n.useOptimistic=function(e,r){return l.H.useOptimistic(e,r)},n.useReducer=function(e,r,s){return l.H.useReducer(e,r,s)},n.useRef=function(e){return l.H.useRef(e)},n.useState=function(e){return l.H.useState(e)},n.useSyncExternalStore=function(e,r,s){return l.H.useSyncExternalStore(e,r,s)},n.useTransition=function(){return l.H.useTransition()},n.version="19.2.3",n}var W;function Q(){return W||(W=1,b.exports=ce()),b.exports}var S=Q();const Ie=se(S);var D={exports:{}},g={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Z;function ae(){if(Z)return g;Z=1;var a=Q();function _(u){var t="https://react.dev/errors/"+u;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var f=2;f<arguments.length;f++)t+="&args[]="+encodeURIComponent(arguments[f])}return"Minified React error #"+u+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function h(){}var y={d:{f:h,r:function(){throw Error(_(522))},D:h,C:h,L:h,m:h,X:h,S:h,M:h},p:0,findDOMNode:null},C=Symbol.for("react.portal");function m(u,t,f){var T=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:C,key:T==null?null:""+T,children:u,containerInfo:t,implementation:f}}var k=a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function R(u,t){if(u==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}return g.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=y,g.createPortal=function(u,t){var f=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(_(299));return m(u,t,null,f)},g.flushSync=function(u){var t=k.T,f=y.p;try{if(k.T=null,y.p=2,u)return u()}finally{k.T=t,y.p=f,y.d.f()}},g.preconnect=function(u,t){typeof u=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,y.d.C(u,t))},g.prefetchDNS=function(u){typeof u=="string"&&y.d.D(u)},g.preinit=function(u,t){if(typeof u=="string"&&t&&typeof t.as=="string"){var f=t.as,T=R(f,t.crossOrigin),O=typeof t.integrity=="string"?t.integrity:void 0,w=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;f==="style"?y.d.S(u,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:T,integrity:O,fetchPriority:w}):f==="script"&&y.d.X(u,{crossOrigin:T,integrity:O,fetchPriority:w,nonce:typeof t.nonce=="string"?t.nonce:void 0})}},g.preinitModule=function(u,t){if(typeof u=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var f=R(t.as,t.crossOrigin);y.d.M(u,{crossOrigin:f,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0})}}else t==null&&y.d.M(u)},g.preload=function(u,t){if(typeof u=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var f=t.as,T=R(f,t.crossOrigin);y.d.L(u,f,{crossOrigin:T,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}},g.preloadModule=function(u,t){if(typeof u=="string")if(t){var f=R(t.as,t.crossOrigin);y.d.m(u,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:f,integrity:typeof t.integrity=="string"?t.integrity:void 0})}else y.d.m(u)},g.requestFormReset=function(u){y.d.r(u)},g.unstable_batchedUpdates=function(u,t){return u(t)},g.useFormState=function(u,t,f){return k.H.useFormState(u,t,f)},g.useFormStatus=function(){return k.H.useHostTransitionStatus()},g.version="19.2.3",g}var X;function qe(){if(X)return D.exports;X=1;function a(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)}catch(_){console.error(_)}}return a(),D.exports=ae(),D.exports}/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),fe=a=>a.replace(/^([A-Z])|[\s-_]+(\w)/g,(_,h,y)=>y?y.toUpperCase():h.toLowerCase()),F=a=>{const _=fe(a);return _.charAt(0).toUpperCase()+_.slice(1)},J=(...a)=>a.filter((_,h,y)=>!!_&&_.trim()!==""&&y.indexOf(_)===h).join(" ").trim(),ye=a=>{for(const _ in a)if(_.startsWith("aria-")||_==="role"||_==="title")return!0};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var le={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=S.forwardRef(({color:a="currentColor",size:_=24,strokeWidth:h=2,absoluteStrokeWidth:y,className:C="",children:m,iconNode:k,...R},u)=>S.createElement("svg",{ref:u,...le,width:_,height:_,stroke:a,strokeWidth:y?Number(h)*24/Number(_):h,className:J("lucide",C),...!m&&!ye(R)&&{"aria-hidden":"true"},...R},[...k.map(([t,f])=>S.createElement(t,f)),...Array.isArray(m)?m:[m]]));/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=(a,_)=>{const h=S.forwardRef(({className:y,...C},m)=>S.createElement(de,{ref:m,iconNode:_,className:J(`lucide-${ie(F(a))}`,`lucide-${a}`,y),...C}));return h.displayName=F(a),h};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]],Ue=p("activity",pe);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _e=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]],Ye=p("book-open",_e);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}]],Ve=p("book",he);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ge=[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]],Ge=p("bot",ge);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=[["path",{d:"M21.54 15H17a2 2 0 0 0-2 2v4.54",key:"1djwo0"}],["path",{d:"M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",key:"1tzkfa"}],["path",{d:"M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",key:"14pb5j"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],Be=p("earth",ve);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],Ke=p("eye",me);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ee=[["path",{d:"M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528",key:"1jaruq"}]],We=p("flag",Ee);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ke=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],Ze=p("globe",ke);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Re=[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]],Xe=p("graduation-cap",Re);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}],["path",{d:"M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27",key:"auskq0"}]],Fe=p("heart-pulse",Te);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ce=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],Qe=p("info",Ce);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ae=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],Je=p("layout-dashboard",Ae);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Me=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],et=p("loader-circle",Me);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Se=[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}]],tt=p("message-square",Se);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oe=[["path",{d:"M6 18h8",key:"1borvv"}],["path",{d:"M3 22h18",key:"8prr45"}],["path",{d:"M14 22a7 7 0 1 0 0-14h-1",key:"1jwaiy"}],["path",{d:"M9 14h2",key:"197e7h"}],["path",{d:"M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z",key:"1bmzmy"}],["path",{d:"M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3",key:"1drr47"}]],rt=p("microscope",Oe);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],nt=p("play",we);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ne=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],ot=p("send",Ne);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $e=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],ut=p("shield-check",$e);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],st=p("shield",xe);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const He=[["path",{d:"m12.5 17-.5-1-.5 1h1z",key:"3me087"}],["path",{d:"M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z",key:"1o5pge"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}]],ct=p("skull",He);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],at=p("target",Pe);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const je=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],it=p("users",je);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Le=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]],ft=p("volume-2",Le);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const be=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]],yt=p("volume-x",be);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const De=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],lt=p("zap",De);export{Ue as A,Ye as B,Be as E,We as F,Ze as G,Fe as H,Qe as I,et as L,rt as M,nt as P,Ie as R,ct as S,at as T,it as U,ft as V,lt as Z,qe as a,S as b,st as c,ze as d,Ke as e,Ge as f,se as g,ot as h,ut as i,Ve as j,Je as k,tt as l,yt as m,Xe as n,Q as r};
