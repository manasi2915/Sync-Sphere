module.exports = function(role){
  return async (req,res,next)=>{
    try {
      if(!req.user) return res.status(401).json({ msg: 'Unauthorized' });
      if(req.user.role !== role) return res.status(403).json({ msg: 'Forbidden: requires ' + role });
      next();
    } catch(err){ next(err); }
  }
}
