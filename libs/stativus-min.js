/*globals Stativus DEBUG_MODE EVENTABLE COLOR_MODE EVENT_COLOR EXIT_COLOR ENTER_COLOR exports $ *//**
  This is the code for creating statecharts in your javascript files
  
  @author: Evin Grano
  @version: 0.7.0
*/var creator=function(){function e(){}return e.prototype=this,new e},merge=function(e,t){var n,r,i,s;e=e||{};for(r=1,i=t.length||0;r<i;r++){n=t[r];if(typeof n=="object")for(s in n)n.hasOwnProperty(s)&&(e[s]=n[s])}return e};Stativus={DEFAULT_TREE:"default",SUBSTATE_DELIM:"SUBSTATE:",version:"0.7.0"},Stativus.State={isState:!0,_data:null,_isNone:function(e){return e===undefined||e===null},goToState:function(e){var t=this.statechart;t&&t.goToState(e,this.globalConcurrentState,this.localConcurrentState)},goToHistoryState:function(e,t){var n=this.statechart;n&&n.goToHistoryState(e,this.globalConcurrentState,this.localConcurrentState,t)},sendEvent:function(e){var t=this.statechart;t&&t.sendEvent.apply(t,arguments)},getData:function(e){if(this._isNone(e))return e;var t=this.statechart,n=this._data[e];return this._isNone(n)&&(n=t.getData(e,this.parentState,this.globalConcurrentState)),n},setData:function(e,t){if(this._isNone(e))return t;this._data[e]=t},removeData:function(e){if(this._isNone(e))return e;var t=this.statechart,n=this._data[e];this._isNone(n)?t.removeData(e,this.parentState,this.globalConcurrentState):delete this._data[e]},setHistoryState:function(e){this.history=this.history||{},this.substatesAreConcurrent?this.history[this.localConcurrentState]=e.name:this.history=e.name}},Stativus.State.create=function(e){var t,n,r,i,s;e=e||[],t=creator.call(this),t._data={};for(i=0,s=e.length||0;i<s;i++){r=e[i];if(typeof r=="object")for(n in r)r.hasOwnProperty(n)&&(t[n]=r[n])}return t},Stativus.Statechart={isStatechart:!0,create:function(e){var t=creator.call(this);return t._all_states={},t._all_states[Stativus.DEFAULT_TREE]={},t._states_with_concurrent_substates={},t._current_subtrees={},t._current_state={},t._current_state[Stativus.DEFAULT_TREE]=null,t._goToStateLocked=!1,t._sendEventLocked=!1,t._pendingStateTransitions=[],t._pendingEvents=[],t._active_subtrees={},t},addState:function(e){var t,n,r=!1,i,s,o,u,a,f=[],l,c,h=this;for(c=1,l=arguments.length;c<l;c++)f[c-1]=a=arguments[c],r=r||!!a.substatesAreConcurrent,i=i||a.parentState;return l===1&&(f[0]=a={}),a.name=e,a.statechart=this,a.history=null,t=a.globalConcurrentState||Stativus.DEFAULT_TREE,a.globalConcurrentState=t,o=this._states_with_concurrent_substates[t],r&&(n=this._states_with_concurrent_substates[t]||{},n[e]=!0,this._states_with_concurrent_substates[t]=n),i&&o&&o[i]&&(i=this._all_states[t][i],i&&(i.substates=i.substates||[],i.substates.push(e))),u=Stativus.State.create(f),u.sendAction=u.sendEvent,n=this._all_states[t],n||(n={}),n[e]=u,this._all_states[t]=n,u._beenAdded=!0,s=u.states||[],s.forEach(function(n,r){var i=[],s=!1,o;typeof n=="object"&&n.length>0?(i=i.concat(n),s=!0):typeof n=="string"?(i.push(n),s=!0):typeof n=="object"&&(typeof n.name!="string",i.push(n.name),i.push(n),s=!0),s&&(o=i.length-1,i[o].parentState=e,i[o].globalConcurrentState=t,h.addState.apply(h,i))}),this},initStates:function(e){var t,n;this._inInitialSetup=!0;if(typeof e=="string")this.goToState(e,Stativus.DEFAULT_TREE);else if(typeof e=="object")for(t in e)e.hasOwnProperty(t)&&(n=e[t],this.goToState(n,t));return this._inInitialSetup=!1,this._flushPendingEvents(),this},goToState:function(e,t,n){var r,i=this._all_states[t],s,o,u=[],a=[],f,l,c,h,p,d,v,m,g,y,b;r=n?this._current_state[n]:this._current_state[t],p=i[e];if(this._checkAllCurrentStates(p,n||t))return;if(this._goToStateLocked){this._pendingStateTransitions.push({requestedState:e,tree:t});return}this._goToStateLocked=!0,u=this._parentStatesWithRoot(p),a=r?this._parentStatesWithRoot(r):[],l=-1;for(s=0,o=a.length;s<o;s++){c=s,l=u.indexOf(a[s]);if(l>=0)break}l<0&&(l=u.length-1),this._enterStates=u,this._enterStateMatchIndex=l,this._enterStateConcurrentTree=n,this._enterStateTree=t,this._exitStateStack=[],r&&r.substatesAreConcurrent&&this._fullExitFromSubstates(t,r);for(v=0;v<c;v+=1)r=a[v],this._exitStateStack.push(r);this._unwindExitStateStack()},goToHistoryState:function(e,t,n,r){var i=this._all_states[t],s,o;s=i[e],s&&(o=s.history||s.initialSubstate);if(!o)o=e;else if(r){this.goToHistoryState(o,t,r);return}this.goToState(o,t)},currentState:function(e){var t,n,r,i,s,o=this._current_state,u,a,f,l,c,h;e=e||"default",u=o[e],h=this._all_states[e],u&&u.isState&&(t=this._parentStates(u));if(u&&u.substatesAreConcurrent){i=this._active_subtrees[e]||[];for(a=0,f=i.length;a<f;a++)r=i[a],l=o[r],l&&(c=h[l.parentState]),c&&t.indexOf(c)<0&&t.unshift(c),l&&t.indexOf(l)<0&&t.unshift(l)}return t},sendEvent:function(e){var t=[],n=arguments.length,r;if(n<1)return;for(r=1;r<n;r++)t[r-1]=arguments[r];try{if(this._inInitialSetup||this._sendEventLocked||this._goToStateLocked){this._pendingEvents.push({evt:e,args:t});return}this._sendEventLocked=!0,this._processEvent(e,t)}catch(i){throw this._restartEvents(),i}this._restartEvents()},_processEvent:function(e,t){this._structureCrawl("_cascadeEvents",e,t)},getData:function(e,t,n){var r=this._all_states[n],i;if(!r)return null;i=r[t];if(i&&i.isState)return i.getData(e)},removeData:function(e,t,n){var r=this._all_states[n],i;if(!r)return null;i=r[t];if(i&&i.isState)return i.removeData(e)},getState:function(e,t){var n,r;return t=t||Stativus.DEFAULT_TREE,n=this._all_states[t],n?(r=n[e],r):null},_restartEvents:function(){this._sendEventLocked=!1,this._inInitialSetup||this._flushPendingEvents()},_structureCrawl:function(e,t,n){var r,i=this._current_state,s,o,u,a,f,l,c,h,p,d,v=Stativus.SUBSTATE_DELIM;for(r in i){if(!i.hasOwnProperty(r))continue;p=!1,h=null,l=i[r];if(!l||r.slice(0,v.length)===v)continue;f=this._all_states[r];if(!f)continue;c=this._active_subtrees[r]||[];for(s=0,o=c.length;s<o;s++)h=c[s],u=i[h],a=p?[!0,!0]:this[e](t,n,u,f,h),p=a[0];p||(a=this[e](t,n,l,f,null),p=a[0])}},_cascadeEvents:function(e,t,n,r,i){var s,o,u,a,f=!1;i&&(o=i.split("=>"),u=o.length||0,a=o[u-1]);while(!s&&n){n[e]&&(s=n[e].apply(n,t),f=!0);if(i&&a===n.name)return[s,f];n=!s&&n.parentState?r[n.parentState]:null}return[s,f]},_checkAllCurrentStates:function(e,t){var n=this.currentState(t)||[];return n===e?!0:typeof n=="string"&&e===this._all_states[t][n]?!0:n.indexOf&&n.indexOf(e)>-1?!0:!1},_flushPendingEvents:function(){var e,t=this._pendingEvents.shift();if(!t)return;e=t.args,e.unshift(t.evt),this.sendEvent.apply(this,e)},_flushPendingStateTransitions:function(){var e=this._pendingStateTransitions.shift(),t;return e?(this.goToState(e.requestedState,e.tree),!0):!1},_parentStateObject:function(e,t){if(e&&t&&this._all_states[t]&&this._all_states[t][e])return this._all_states[t][e]},_fullEnter:function(e){var t,n=!1;if(!e)return;e.enterState&&e.enterState(),e.didEnterState&&e.didEnterState(),e.parentState&&(t=e.statechart.getState(e.parentState,e.globalConcurrentState),t.setHistoryState(e)),this._unwindEnterStateStack()},_fullExit:function(e){var t;if(!e)return;var n=!1;e.exitState&&e.exitState(),e.didExitState&&e.didExitState(),this._unwindExitStateStack()},_initiateEnterStateSequence:function(){var e,t,n,r,i,s,o;e=this._enterStates,t=this._enterStateMatchIndex,n=this._enterStateConcurrentTree,r=this._enterStateTree,i=this._all_states[r],this._enterStateStack=this._enterStateStack||[],s=t-1,o=e[s],o&&this._cascadeEnterSubstates(o,e,s-1,n||r,i),this._unwindEnterStateStack(),e=null,t=null,n=null,r=null,delete this._enterStates,delete this._enterStateMatchIndex,delete this._enterStateConcurrentTree,delete this._enterStateTree},_cascadeEnterSubstates:function(e,t,n,r,i){var s,o=t.length,u,a,f=this,l,c,h,p,d,v;if(!e)return;h=e.name,this._enterStateStack.push(e),this._current_state[r]=e,e.localConcurrentState=r;if(e.substatesAreConcurrent){r=e.globalConcurrentState||Stativus.DEFAULT_TREE,v=[Stativus.SUBSTATE_DELIM,r,h].join("=>"),e.history=e.history||{},a=e.substates||[],a.forEach(function(e){l=v+"=>"+e,s=i[e],c=s.globalConcurrentState||Stativus.DEFAULT_TREE,d=f._active_subtrees[c]||[],d.unshift(l),f._active_subtrees[c]=d,n>-1&&t[n]===s&&(n-=1),f._cascadeEnterSubstates(s,t,n,l,i)});return}s=t[n],s?(n>-1&&t[n]===s&&(n-=1),this._cascadeEnterSubstates(s,t,n,r,i)):(s=i[e.initialSubstate],this._cascadeEnterSubstates(s,t,n,r,i))},_fullExitFromSubstates:function(e,t){var n,r,i,s=this;if(!e||!t||!e||!t.substates)return;r=this._all_states[e],n=this._current_state,this._exitStateStack=this._exitStateStack||[],t.substates.forEach(function(i){var o,u,a,f,l;o=[Stativus.SUBSTATE_DELIM,e,t.name,i].join("=>"),u=n[o];while(u&&u!==t){f=!1;if(!u)continue;s._exitStateStack.unshift(u),u.substatesAreConcurrent&&s._fullExitFromSubstates(e,u),a=u.parentState,u=r[a]}s._active_subtrees[e]=s._removeFromActiveTree(e,o)})},_unwindExitStateStack:function(){var e,t=!1,n;this._exitStateStack=this._exitStateStack||[],e=this._exitStateStack.shift(),e?(e.willExitState&&(n={_statechart:this,_start:e,restart:function(){var e=this._statechart;e&&e._fullExit(this._start)}},t=e.willExitState(n)),t||this._fullExit(e)):(delete this._exitStateStack,this._initiateEnterStateSequence())},_unwindEnterStateStack:function(){var e,t=!1,n,r,i=this;this._exitStateStack=this._exitStateStack||[],e=this._enterStateStack.shift(),e?(e.willEnterState&&(n=function(){i&&i._fullEnter(e)},t=e.willEnterState(n)),t||this._fullEnter(e)):(delete this._enterStateStack,this._goToStateLocked=!1,r=this._flushPendingStateTransitions(),!r&&!this._inInitialSetup&&this._flushPendingEvents())},_removeFromActiveTree:function(e,t){var n=[],r=this._active_subtrees[e];return r?t?(r.forEach(function(e){e!==t&&n.push(e)}),n):r:[]},_parentStates:function(e){var t=[],n=e;t.push(n),n=this._parentStateObject(n.parentState,n.globalConcurrentState);while(n)t.push(n),n=this._parentStateObject(n.parentState,n.globalConcurrentState);return t},_parentStatesWithRoot:function(e){var t=this._parentStates(e);return t.push("root"),t}},Stativus.createStatechart=function(){return this.Statechart.create()},typeof window!="undefined"?window.Stativus=Stativus:typeof exports!="undefined"&&(module.exports=Stativus);