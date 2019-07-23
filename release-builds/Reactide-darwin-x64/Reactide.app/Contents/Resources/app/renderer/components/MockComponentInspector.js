import React from 'react';
import { Terminal } from 'xterm';
const MockComponentInspector = () => (
  <div id='terminal'>
    <script>
      
    </script>
  </div>
  // <div className="item-views">
  //   <div className="styleguide pane-item">
  //     <header className="styleguide-header">
  //       <h5>Component Inspector</h5>
  //     </header>
  //     <main className="styleguide-sections">

  //       <section className="bordered">
  //         <h3>Props</h3>
  //         <div className="control">
  //           <div className="control-rendered">
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">className</div>
  //                 <div className="controls">
  //                   <input className="input-text" type="text" placeholder="todo-item active" />
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">placeholder</div>
  //                 <div className="controls">
  //                   <input
  //                     className="input-text"
  //                     type="text"
  //                     placeholder="What needs to be done?"
  //                   />
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">value</div>
  //                 <div className="controls">
  //                   <input className="input-text" type="text" placeholder="" />
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">autoFocus</div>
  //                 <div className="controls">
  //                   <div className="btn-group">
  //                     <button className="btn">Off</button>
  //                     <button className="btn selected">On</button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </section>
  //       <section className="bordered">
  //         <h3>Styles</h3>
  //         <div className="control">
  //           <div className="control-rendered">
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">count</div>
  //                 <div className="controls"><input className="input-range" type="range" /></div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">columns</div>
  //                 <div className="controls"><input className="input-range" type="range" /></div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">width</div>
  //                 <div className="controls"><input className="input-range" type="range" /></div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">padding</div>
  //                 <div className="controls"><input className="input-number" type="number" min="1" max="10" placeholder="1-10" /></div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">margin</div>
  //                 <div className="controls"><input className="input-number" type="number" min="1" max="10" placeholder="1-10" /></div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">color</div>
  //                 <div className="controls"><input className="input-color" type="color" value="#FF85FF" /></div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">position</div>
  //                 <div className="controls">
  //                   <select className="input-select"><option>Relative</option><option>Option 2</option><option>Option 3</option></select>
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">float</div>
  //                 <div className="controls"><select className="input-select"><option>Left</option><option>Option 2</option><option>Option 3</option></select></div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">active</div>
  //                 <div className="controls">
  //                   <div className="btn-group">
  //                     <button className="btn">Off</button>
  //                     <button className="btn selected">On</button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </section>

  //       <section className="bordered">
  //         {
  //           // yes, it is quite chilly in here...
  //         }
  //         <br /><br /><br /><br /><br /><br /><br /><br /><br />
  //         <br /><br /><br /><br /><br /><br /><br /><br /><br />
  //         <br /><br /><br /><br /><br /><br /><br /><br /><br />
  //         <br /><br /><br /><br /><br /><br /><br /><br /><br />
  //         <br /><br /><br /><br /><br /><br /><br /><br /><br />
  //         <h1 className="section-heading">Controls Library</h1>
  //         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
  //         <h3>Button Groups &amp; Selectors</h3>
  //         <div className="control">
  //           <div className="control-rendered">
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">Sample</div>
  //                 <div className="controls">
  //                   <div className="btn-group">
  //                     <button className="btn">One</button>
  //                     <button className="btn selected">Two</button>
  //                     <button className="btn">Three</button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <h3>Selectors</h3>
  //         <div className="control">
  //           <div className="control-rendered">
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">Range</div>
  //                 <div className="controls"><input className="input-range" type="range" /></div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">Number</div>
  //                 <div className="controls">
  //                   <input
  //                     className="input-number"
  //                     type="number"
  //                     min="1" max="10"
  //                     placeholder="1-10"
  //                   />
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">Color</div>
  //                 <div className="controls">
  //                   <input className="input-color" type="color" value="#FF85FF" />
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">Selector</div>
  //                 <div className="controls">
  //                   <select className="input-select">
  //                     <option>Option 1</option>
  //                     <option>Option 2</option>
  //                     <option>Option 3</option>
  //                   </select>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <h3>Booleans</h3>
  //         <div className="control">
  //           <div className="control-rendered">
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">Checkbox</div>
  //                 <div className="controls">
  //                   <input className="input-checkbox" type="checkbox" checked />
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">Toggle</div>
  //                 <div className="controls">
  //                   <input className="input-toggle" type="checkbox" checked />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <h3>Inputs Alternate</h3>
  //         <div className="control">
  //           <div className="control-rendered">
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">Text Input</div>
  //                 <div className="controls">
  //                   <input className="input-text" type="text" placeholder="Text" />
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="block">
  //               <div className="control-wrap">
  //                 <div className="label">Search Input</div>
  //                 <div className="controls">
  //                   <input className="input-search" type="search" placeholder="Search" />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <h3>Wide Inputs</h3>
  //         <div className="control">
  //           <div className="control-rendered">
  //             <input className="input-text" type="text" placeholder="Text" />
  //             <input className="input-search" type="search" placeholder="Search" />
  //             <textarea className="input-textarea" placeholder="Text Area"></textarea>
  //           </div>
  //         </div>
  //       </section>
  //     </main>
  //   </div>
  // </div>
);

export default MockComponentInspector;
