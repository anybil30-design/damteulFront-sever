import React, {useState} from 'react';
import './styles/supportList.css';
import { FaAngleDown } from "react-icons/fa6";



function SupportList({data, type}) {

	const [selectedId, setSelectedId] = useState(null);

	const handleToggle = (id) =>{
		if(type !== 'notice'){
			// 열린거 누르면 null, 아니면 해당 id 저장
			setSelectedId(selectedId === id?null:id);
		}
	}
	return (
			<section className='supportList'>
				<ul>
				{data.map((item)=>{
					const isOpen = selectedId === item.id;
					return(
						<li key={item.id}>
						<hr/>
						<div className='question'
						onClick={()=>handleToggle(item.id)}>
							<span>{item.cate}</span>
							<h4>{item.title}</h4>
							{type !== 'notice' &&(
								<FaAngleDown 
								className={isOpen?'transition':''}/>
							)}
										
						</div>
						
						{/* 질문 클릭 시 보여질 내용 */}
						{isOpen &&
						<>
							<div className='questionContent'>
							<p>{item.content}</p>
							<span>{item.date}</span>
							</div>
							{/* 답변 영역 */}
							<div className='faqAnswer'>
							<p>{item.answer}</p>
							</div>
						</>
						}
						
						<hr/>
					</li>
					)
				})}
				</ul>
			</section>
	);
}

export default SupportList;